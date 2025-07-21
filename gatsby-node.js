const { createFilePath } = require(`gatsby-source-filesystem`)
const fs = require('fs')
const path = require('path')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField, createNode } = actions
  
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    
    // Add lang field based on file path
    const filePath = node.fileAbsolutePath
    if (filePath) {
      const langMatch = filePath.match(/\/([a-z]{2})\//)
      if (langMatch) {
        createNodeField({
          node,
          name: `lang`,
          value: langMatch[1],
        })
      }
    }
  }
  
  // Create Code nodes from code files
  if (node.internal.type === `File` && node.sourceInstanceName === `exercises`) {
    const filePath = node.relativePath
    const langMatch = filePath.match(/^([a-z]{2})\//)
    const lang = langMatch ? langMatch[1] : 'en'
    
    // Only process code files
    const codeExtensions = ['py', 'sh', 'js', 'json', 'cfg']
    const extension = node.extension
    if (codeExtensions.includes(extension)) {
      const name = node.name
      
      try {
        // Read the file content
        const code = fs.readFileSync(node.absolutePath, 'utf8')
        
        const codeNode = {
          id: `code-${node.id}`,
          parent: node.id,
          children: [],
          internal: {
            type: `Code`,
            contentDigest: node.internal.contentDigest,
          },
          code,
          lang,
          name,
          extension,
        }
        
        createNode(codeNode)
      } catch (error) {
        console.warn(`Failed to read file ${node.absolutePath}:`, error.message)
      }
    }
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type MarkdownRemark implements Node {
      fields: MarkdownRemarkFields
    }
    type MarkdownRemarkFields {
      slug: String
      lang: String
    }
    type Code implements Node {
      code: String
      lang: String
      name: String
      extension: String
    }
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
              lang
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: require.resolve(`./src/templates/chapter.js`),
      context: {
        slug: node.fields.slug,
        lang: node.fields.lang,
      },
    })
  })
} 

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /plyr\.min\.(mjs|js)$/,
          use: 'null-loader',
        },
      ],
    },
  })
} 