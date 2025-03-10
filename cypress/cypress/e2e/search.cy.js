/// <reference types="cypress" />

const URL_BASE = 'https://citydev-portal.edinburgh.gov.uk'
const SEARCH_URL = `${URL_BASE}/idoxpa-web/search.do?action=advanced`
const SEARCH_PHRASE = 'short term let'
const APPLICATIONS_FILE = `${Cypress.config('fileServerFolder')}/data/applications.json`;
let newApplications = []


const getDaysAgo = days => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date
}

const START_DATE = getDaysAgo(90)

const getPostcode = string => {
  const match = string.match(/[a-z0-9]{3,4}\s[a-z0-9]{3,4}$/i)
  return match ? match[0] : ''
}

describe('Searches Edinburgh council planning site', () => {

  it('Finds new applications', () => {
    cy.visit(SEARCH_URL)
    cy.get('#description')
      .type(SEARCH_PHRASE)
    cy.get('#caseStatus')
      .select('Awaiting Assessment')
    cy.get('#applicationReceivedStart')
      .type(
        [
          START_DATE.getDate(),
          START_DATE.getMonth(),
          START_DATE.getFullYear(),
        ].join('/')
      )
    cy.get('input[type="submit"]')
        .should('exist')
      .contains('Search')
      .click()
    cy.get('.content')
      .then($el => {
        return $el.find('#resultsPerPage').length
      })
      .then(hasResults => {
        if (!hasResults) {
          return
        }
        cy.get('#resultsPerPage')
          .select('100')
        cy.get('input[type="submit"]')
        .should('exist')
          .contains('Go')
          .click()
        cy.get('#searchresults li')
          .each($li => {
            const $link = $li.find('a')
            const [refNo, received, validated, status] = $li.find('.metaInfo')
              .text()
              .trim()
              .replace(new RegExp(/\\n/g), '')
              .replace(new RegExp(/([\s]+)/g), ' ')
              .split(' | ')
            const address = $li.find('.address').text().trim()
            newApplications.push({
              link: [URL_BASE, $link.attr('href')].join(''),
              proposal: $link.text().trim(),
              address,
              postcode: getPostcode(address),
              refNo,
              received,
              validated,
              status
            })
          })
      })
  })

  it('Saves new applications', () => {
    cy.writeFile(APPLICATIONS_FILE, JSON.stringify(newApplications, null, 2))
  })
})