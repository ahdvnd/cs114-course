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
    
    // Set language to English for all content
    createNodeField({
      node,
      name: `lang`,
      value: 'en',
    })
  }
  
  // Create Code nodes from code files
  if (node.internal.type === `File` && node.sourceInstanceName === `exercises`) {
    const fileExt = path.extname(node.name)
    const allowedExtensions = ['.py', '.sh', '.js', '.json', '.cfg']
    
    if (allowedExtensions.includes(fileExt)) {
      try {
        const fileContent = fs.readFileSync(node.absolutePath, 'utf8')
        const codeNode = {
          id: `${node.id}-code`,
          code: fileContent,
          lang: 'en', // Set to English
          name: path.basename(node.name, fileExt),
          extension: fileExt.substring(1),
          internal: {
            type: 'Code',
            contentDigest: require('crypto').createHash('md5').update(fileContent).digest('hex'),
          },
        }
        
        createNode(codeNode)
      } catch (error) {
        console.warn(`Error reading file ${node.absolutePath}:`, error.message)
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