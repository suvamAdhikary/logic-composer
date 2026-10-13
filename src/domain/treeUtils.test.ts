import { describe, it, expect, beforeEach } from 'vitest'
import {
  createRule,
  createGroup,
  updateNodeById,
  insertChild,
  deleteNodeById,
} from './treeUtils'
import type { GroupNode, RuleNode, ConditionNode } from './types'

describe('treeUtils', () => {
  describe('createRule', () => {
    it('should create a rule with default values', () => {
      const rule = createRule()

      expect(rule.type).toBe('rule')
      expect(rule.field).toBe('Price')
      expect(rule.operator).toBe('>')
      expect(rule.value).toBe('')
      expect(rule.id).toBeTruthy()
      expect(typeof rule.id).toBe('string')
    })

    it('should generate unique IDs for each rule', () => {
      const rule1 = createRule()
      const rule2 = createRule()

      expect(rule1.id).not.toBe(rule2.id)
    })
  })

  describe('createGroup', () => {
    it('should create a group with default values', () => {
      const group = createGroup()

      expect(group.type).toBe('group')
      expect(group.operator).toBe('AND')
      expect(group.children).toEqual([])
      expect(group.id).toBeTruthy()
      expect(typeof group.id).toBe('string')
    })

    it('should generate unique IDs for each group', () => {
      const group1 = createGroup()
      const group2 = createGroup()

      expect(group1.id).not.toBe(group2.id)
    })
  })

  describe('updateNodeById', () => {
    let root: GroupNode

    beforeEach(() => {
      root = {
        id: 'root',
        type: 'group',
        operator: 'AND',
        children: [
          {
            id: 'rule1',
            type: 'rule',
            field: 'Price',
            operator: '>',
            value: '100',
          } as RuleNode,
          {
            id: 'group1',
            type: 'group',
            operator: 'OR',
            children: [
              {
                id: 'rule2',
                type: 'rule',
                field: 'Category',
                operator: '=',
                value: 'Electronics',
              } as RuleNode,
            ],
          } as GroupNode,
        ],
      }
    })

    it('should update the root node when targetId matches root', () => {
      const updated = updateNodeById(root, 'root', (node) => {
        if (node.type === 'group') {
          return { ...node, operator: 'OR' }
        }
        return node
      })

      expect(updated.operator).toBe('OR')
      expect(updated.id).toBe('root')
    })

    it('should update a direct child rule', () => {
      const updated = updateNodeById(root, 'rule1', (node) => ({
        ...node,
        value: '200',
      }))

      const updatedRule = updated.children[0] as RuleNode
      expect(updatedRule.value).toBe('200')
      expect(updatedRule.id).toBe('rule1')
    })

    it('should update a nested group', () => {
      const updated = updateNodeById(root, 'group1', (node) => {
        if (node.type === 'group') {
          return { ...node, operator: 'AND' }
        }
        return node
      })

      const updatedGroup = updated.children[1] as GroupNode
      expect(updatedGroup.operator).toBe('AND')
      expect(updatedGroup.id).toBe('group1')
    })

    it('should update a deeply nested rule', () => {
      const updated = updateNodeById(root, 'rule2', (node) => ({
        ...node,
        value: 'Books',
      }))

      const nestedGroup = updated.children[1] as GroupNode
      const updatedRule = nestedGroup.children[0] as RuleNode
      expect(updatedRule.value).toBe('Books')
    })

    it('should not mutate the original tree', () => {
      const originalRoot = JSON.parse(JSON.stringify(root))
      updateNodeById(root, 'rule1', (node) => ({
        ...node,
        value: '999',
      }))

      expect(root).toEqual(originalRoot)
    })

    it('should preserve unaffected nodes', () => {
      const updated = updateNodeById(root, 'rule1', (node) => ({
        ...node,
        value: '999',
      }))

      const unchangedGroup = updated.children[1] as GroupNode
      expect(unchangedGroup.id).toBe('group1')
      expect(unchangedGroup.children).toHaveLength(1)
    })

    it('should handle non-existent targetId gracefully', () => {
      const updated = updateNodeById(root, 'nonexistent', (node) => ({
        ...node,
      }))

      expect(updated).toEqual(root)
    })

    it('should update multiple fields at once', () => {
      const updated = updateNodeById(root, 'rule1', (node) => {
        if (node.type === 'rule') {
          return {
            ...node,
            field: 'Rating' as const,
            operator: '<' as const,
            value: '5',
          }
        }
        return node
      })

      const updatedRule = updated.children[0] as RuleNode
      expect(updatedRule.field).toBe('Rating')
      expect(updatedRule.operator).toBe('<')
      expect(updatedRule.value).toBe('5')
    })
  })

  describe('insertChild', () => {
    let root: GroupNode
    let newRule: RuleNode
    let newGroup: GroupNode

    beforeEach(() => {
      root = {
        id: 'root',
        type: 'group',
        operator: 'AND',
        children: [
          {
            id: 'rule1',
            type: 'rule',
            field: 'Price',
            operator: '>',
            value: '100',
          } as RuleNode,
        ],
      }

      newRule = {
        id: 'rule2',
        type: 'rule',
        field: 'Category',
        operator: '=',
        value: 'Books',
      }

      newGroup = {
        id: 'group1',
        type: 'group',
        operator: 'OR',
        children: [],
      }
    })

    it('should insert a rule into the root group', () => {
      const updated = insertChild(root, 'root', newRule)

      expect(updated.children).toHaveLength(2)
      expect(updated.children[1]).toEqual(newRule)
    })

    it('should insert a group into the root group', () => {
      const updated = insertChild(root, 'root', newGroup)

      expect(updated.children).toHaveLength(2)
      expect(updated.children[1]).toEqual(newGroup)
    })

    it('should insert into a nested group', () => {
      const nestedGroup: GroupNode = {
        id: 'nested',
        type: 'group',
        operator: 'OR',
        children: [],
      }

      root.children.push(nestedGroup)
      const updated = insertChild(root, 'nested', newRule)

      const updatedNested = updated.children[1] as GroupNode
      expect(updatedNested.children).toHaveLength(1)
      expect(updatedNested.children[0]).toEqual(newRule)
    })

    it('should not mutate the original tree', () => {
      const originalRoot = JSON.parse(JSON.stringify(root))
      insertChild(root, 'root', newRule)

      expect(root).toEqual(originalRoot)
    })

    it('should preserve existing children when inserting', () => {
      const updated = insertChild(root, 'root', newRule)

      expect(updated.children[0]).toEqual(root.children[0])
      expect(updated.children).toHaveLength(2)
    })

    it('should handle deeply nested insertion', () => {
      const level1: GroupNode = {
        id: 'level1',
        type: 'group',
        operator: 'AND',
        children: [],
      }

      const level2: GroupNode = {
        id: 'level2',
        type: 'group',
        operator: 'OR',
        children: [],
      }

      root.children.push(level1)
      root = insertChild(root, 'level1', level2)
      const updated = insertChild(root, 'level2', newRule)

      const l1 = updated.children[1] as GroupNode
      const l2 = l1.children[0] as GroupNode
      expect(l2.children).toHaveLength(1)
      expect(l2.children[0]).toEqual(newRule)
    })

    it('should return unchanged tree if groupId not found', () => {
      const updated = insertChild(root, 'nonexistent', newRule)

      expect(updated).toEqual(root)
    })

    it('should insert multiple children sequentially', () => {
      let updated = insertChild(root, 'root', newRule)
      updated = insertChild(updated, 'root', newGroup)

      expect(updated.children).toHaveLength(3)
    })
  })

  describe('deleteNodeById', () => {
    let root: GroupNode

    beforeEach(() => {
      root = {
        id: 'root',
        type: 'group',
        operator: 'AND',
        children: [
          {
            id: 'rule1',
            type: 'rule',
            field: 'Price',
            operator: '>',
            value: '100',
          } as RuleNode,
          {
            id: 'group1',
            type: 'group',
            operator: 'OR',
            children: [
              {
                id: 'rule2',
                type: 'rule',
                field: 'Category',
                operator: '=',
                value: 'Electronics',
              } as RuleNode,
              {
                id: 'rule3',
                type: 'rule',
                field: 'Rating',
                operator: '>=',
                value: '4',
              } as RuleNode,
            ],
          } as GroupNode,
        ],
      }
    })

    it('should delete a direct child rule', () => {
      const updated = deleteNodeById(root, 'rule1')

      expect(updated.children).toHaveLength(1)
      expect(updated.children[0].id).toBe('group1')
    })

    it('should delete a nested group', () => {
      const updated = deleteNodeById(root, 'group1')

      expect(updated.children).toHaveLength(1)
      expect(updated.children[0].id).toBe('rule1')
    })

    it('should delete a deeply nested rule', () => {
      const updated = deleteNodeById(root, 'rule2')

      const nestedGroup = updated.children[1] as GroupNode
      expect(nestedGroup.children).toHaveLength(1)
      expect(nestedGroup.children[0].id).toBe('rule3')
    })

    it('should clear children when deleting root', () => {
      const updated = deleteNodeById(root, 'root')

      expect(updated.id).toBe('root')
      expect(updated.children).toEqual([])
    })

    it('should not mutate the original tree', () => {
      const originalRoot = JSON.parse(JSON.stringify(root))
      deleteNodeById(root, 'rule1')

      expect(root).toEqual(originalRoot)
    })

    it('should preserve unaffected nodes', () => {
      const updated = deleteNodeById(root, 'rule2')

      expect(updated.children[0].id).toBe('rule1')
      const nestedGroup = updated.children[1] as GroupNode
      expect(nestedGroup.children[0].id).toBe('rule3')
    })

    it('should handle non-existent targetId gracefully', () => {
      const updated = deleteNodeById(root, 'nonexistent')

      expect(updated).toEqual(root)
    })

    it('should handle deleting from an empty group', () => {
      const emptyRoot: GroupNode = {
        id: 'empty',
        type: 'group',
        operator: 'AND',
        children: [],
      }

      const updated = deleteNodeById(emptyRoot, 'nonexistent')
      expect(updated).toEqual(emptyRoot)
    })

    it('should delete all children from a group sequentially', () => {
      let updated = deleteNodeById(root, 'rule2')
      updated = deleteNodeById(updated, 'rule3')

      const nestedGroup = updated.children[1] as GroupNode
      expect(nestedGroup.children).toEqual([])
    })

    it('should handle complex nested deletions', () => {
      const complexRoot: GroupNode = {
        id: 'root',
        type: 'group',
        operator: 'AND',
        children: [
          {
            id: 'group1',
            type: 'group',
            operator: 'OR',
            children: [
              {
                id: 'group2',
                type: 'group',
                operator: 'AND',
                children: [
                  {
                    id: 'rule1',
                    type: 'rule',
                    field: 'Price',
                    operator: '>',
                    value: '10',
                  } as RuleNode,
                ],
              } as GroupNode,
            ],
          } as GroupNode,
        ],
      }

      const updated = deleteNodeById(complexRoot, 'rule1')
      const g1 = updated.children[0] as GroupNode
      const g2 = g1.children[0] as GroupNode
      expect(g2.children).toEqual([])
    })
  })

  describe('recursive operations', () => {
    it('should handle deep nesting correctly', () => {
      const root: GroupNode = createGroup()
      root.id = 'root'

      // Create a deeply nested structure
      const group0: GroupNode = createGroup()
      group0.id = 'group0'
      
      const group1: GroupNode = createGroup()
      group1.id = 'group1'
      
      const group2: GroupNode = createGroup()
      group2.id = 'group2'
      
      const group3: GroupNode = createGroup()
      group3.id = 'group3'
      
      const group4: GroupNode = createGroup()
      group4.id = 'group4'

      const deepRule = createRule()
      deepRule.id = 'deepRule'

      // Build from innermost to outermost
      group4.children = [deepRule]
      group3.children = [group4]
      group2.children = [group3]
      group1.children = [group2]
      group0.children = [group1]
      root.children = [group0]

      // Navigate down the tree (root -> group0 -> group1 -> group2 -> group3 -> group4 -> rule)
      let current: ConditionNode = root
      for (let i = 0; i < 6; i++) {
        expect(current.type).toBe('group')
        current = (current as GroupNode).children[0]
      }
      expect(current.type).toBe('rule')
      expect(current.id).toBe('deepRule')
    })

    it('should maintain tree structure through multiple operations', () => {
      let root: GroupNode = createGroup()
      root.id = 'root'

      root = insertChild(root, 'root', createRule())
      root = insertChild(root, 'root', createGroup())
      root = updateNodeById(root, root.children[1].id, (node) => {
        if (node.type === 'group') {
          return { ...node, operator: 'OR' as const }
        }
        return node
      })
      root = deleteNodeById(root, root.children[0].id)

      expect(root.children).toHaveLength(1)
      expect(root.children[0].type).toBe('group')
      expect((root.children[0] as GroupNode).operator).toBe('OR')
    })
  })
})
