import { describe, it, expect } from 'vitest'
import type { RuleNode, GroupNode, ConditionNode, Field, Operator } from './types'

describe('types', () => {
  describe('Field type', () => {
    it('should accept valid field values', () => {
      const fields: Field[] = ['Price', 'Category', 'Rating']
      
      fields.forEach((field) => {
        const rule: RuleNode = {
          id: 'test',
          type: 'rule',
          field,
          operator: '>',
          value: 'test',
        }
        expect(rule.field).toBe(field)
      })
    })
  })

  describe('Operator type', () => {
    it('should accept valid operator values', () => {
      const operators: Operator[] = ['>', '<', '=', '!=', '>=', '<=', 'contains']
      
      operators.forEach((operator) => {
        const rule: RuleNode = {
          id: 'test',
          type: 'rule',
          field: 'Price',
          operator,
          value: 'test',
        }
        expect(rule.operator).toBe(operator)
      })
    })
  })

  describe('RuleNode', () => {
    it('should create a valid RuleNode', () => {
      const rule: RuleNode = {
        id: 'rule-1',
        type: 'rule',
        field: 'Price',
        operator: '>',
        value: '100',
      }

      expect(rule.type).toBe('rule')
      expect(rule.id).toBe('rule-1')
      expect(rule.field).toBe('Price')
      expect(rule.operator).toBe('>')
      expect(rule.value).toBe('100')
    })

    it('should allow empty value', () => {
      const rule: RuleNode = {
        id: 'rule-1',
        type: 'rule',
        field: 'Category',
        operator: '=',
        value: '',
      }

      expect(rule.value).toBe('')
    })
  })

  describe('GroupNode', () => {
    it('should create a valid GroupNode with AND operator', () => {
      const group: GroupNode = {
        id: 'group-1',
        type: 'group',
        operator: 'AND',
        children: [],
      }

      expect(group.type).toBe('group')
      expect(group.id).toBe('group-1')
      expect(group.operator).toBe('AND')
      expect(group.children).toEqual([])
    })

    it('should create a valid GroupNode with OR operator', () => {
      const group: GroupNode = {
        id: 'group-1',
        type: 'group',
        operator: 'OR',
        children: [],
      }

      expect(group.operator).toBe('OR')
    })

    it('should allow rules as children', () => {
      const rule: RuleNode = {
        id: 'rule-1',
        type: 'rule',
        field: 'Price',
        operator: '>',
        value: '100',
      }

      const group: GroupNode = {
        id: 'group-1',
        type: 'group',
        operator: 'AND',
        children: [rule],
      }

      expect(group.children).toHaveLength(1)
      expect(group.children[0].type).toBe('rule')
    })

    it('should allow groups as children', () => {
      const childGroup: GroupNode = {
        id: 'group-2',
        type: 'group',
        operator: 'OR',
        children: [],
      }

      const parentGroup: GroupNode = {
        id: 'group-1',
        type: 'group',
        operator: 'AND',
        children: [childGroup],
      }

      expect(parentGroup.children).toHaveLength(1)
      expect(parentGroup.children[0].type).toBe('group')
    })

    it('should allow mixed children', () => {
      const rule: RuleNode = {
        id: 'rule-1',
        type: 'rule',
        field: 'Price',
        operator: '>',
        value: '100',
      }

      const childGroup: GroupNode = {
        id: 'group-2',
        type: 'group',
        operator: 'OR',
        children: [],
      }

      const parentGroup: GroupNode = {
        id: 'group-1',
        type: 'group',
        operator: 'AND',
        children: [rule, childGroup],
      }

      expect(parentGroup.children).toHaveLength(2)
      expect(parentGroup.children[0].type).toBe('rule')
      expect(parentGroup.children[1].type).toBe('group')
    })
  })

  describe('ConditionNode discriminated union', () => {
    it('should discriminate based on type field', () => {
      const rule: ConditionNode = {
        id: 'rule-1',
        type: 'rule',
        field: 'Price',
        operator: '>',
        value: '100',
      }

      const group: ConditionNode = {
        id: 'group-1',
        type: 'group',
        operator: 'AND',
        children: [],
      }

      if (rule.type === 'rule') {
        expect(rule.field).toBe('Price')
        expect(rule.value).toBe('100')
      }

      if (group.type === 'group') {
        expect(group.operator).toBe('AND')
        expect(group.children).toEqual([])
      }
    })

    it('should support nested structures', () => {
      const deeplyNested: GroupNode = {
        id: 'root',
        type: 'group',
        operator: 'AND',
        children: [
          {
            id: 'rule-1',
            type: 'rule',
            field: 'Price',
            operator: '>',
            value: '100',
          },
          {
            id: 'group-1',
            type: 'group',
            operator: 'OR',
            children: [
              {
                id: 'rule-2',
                type: 'rule',
                field: 'Category',
                operator: '=',
                value: 'Electronics',
              },
              {
                id: 'group-2',
                type: 'group',
                operator: 'AND',
                children: [
                  {
                    id: 'rule-3',
                    type: 'rule',
                    field: 'Rating',
                    operator: '>=',
                    value: '4',
                  },
                ],
              },
            ],
          },
        ],
      }

      expect(deeplyNested.children).toHaveLength(2)
      
      const firstChild = deeplyNested.children[0]
      expect(firstChild.type).toBe('rule')

      const secondChild = deeplyNested.children[1]
      expect(secondChild.type).toBe('group')
      
      if (secondChild.type === 'group') {
        expect(secondChild.children).toHaveLength(2)
        const nestedGroup = secondChild.children[1]
        if (nestedGroup.type === 'group') {
          expect(nestedGroup.children).toHaveLength(1)
        }
      }
    })
  })
})
