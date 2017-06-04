
const test = require('tape')
const validate = require('../')
const DEFAULT_MODELS = require('@tradle/models')

const base = [
  {
    id: 'baseempty',
    type: 'tradle.Model',
    properties: {}
  },
  {
    id: 'baseinterface',
    isInterface: true,
    type: 'tradle.Model',
    properties: {
      happy: {
        type: 'string'
      }
    }
  }
]

const good = [
  {
    id: 'good1',
    type: 'tradle.Model',
    properties: {
      a: {
        type: 'object',
        ref: 'baseempty'
      }
    }
  }
]

const bad = [
  {
    model: {
      id: 'bad1',
      type: 'tradle.Model',
      properties: {
        a: {
          type: 'object',
          ref: 'oops'
        }
      }
    },
    error: /non-existent/
  },
  {
    model: {
      id: 'bad2',
      type: 'tradle.Model',
      properties: {
        a: {
          type: 'object',
          ref: 'oops'
        }
      }
    },
    error: /non-existent/
  }
]

const all = base.concat(good)
                .concat(bad.map(item => item.model))

const invalid = bad.map(item => {
  return {
    models: all,
    model: item.model,
    error: item.error
  }
})

test('invalid references', function (t) {
  invalid.forEach(item => {
    t.throws(() => validate.refs({
      models: item.models,
      model: item.model
    }), item.error)
  })

  t.end()
})

test('valid references', function (t) {
  good.forEach(model => {
    t.doesNotThrow(() => validate.refs({
      models: all,
      model
    }))
  })

  t.end()
})

test('get references', function (t) {
  const direct = validate.refs.getDirectReferences(DEFAULT_MODELS['tradle.EmployeeOnboarding'])
    .sort(alphabetical)

  t.same(direct, [
    'tradle.FinancialProduct',
    'tradle.Identity',
    'tradle.Message',
    'tradle.Name'
  ])

  const subset = [
    'tradle.EmployeeOnboarding',
    'tradle.AssignRelationshipManager'
  ]

  const recursive = validate.refs.getReferences({ models: DEFAULT_MODELS, subset })
    .sort(alphabetical)

  t.same(recursive, [
    'tradle.Country',
    'tradle.Document',
    'tradle.Enum',
    'tradle.FinancialProduct',
    'tradle.Form',
    'tradle.Identity',
    'tradle.Language',
    'tradle.Message',
    'tradle.Method',
    'tradle.MyProduct',
    'tradle.Name',
    'tradle.Organization',
    'tradle.Photo',
    'tradle.ProductApplication',
    'tradle.Profile',
    'tradle.SecurityCode',
    'tradle.Verification',
    'tradle.WebSite'
  ])

  t.end()
})

function alphabetical (a, b) {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}
