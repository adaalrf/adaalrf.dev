import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { createPostItem } from '../utils/pagination-utils.js';
import {
  ensureDirectoryExists,
  readFileContent,
} from '../utils/parsing-utils.js';
import config from '../config.js';

/**
 * Generates intermediate post HTML files.
 * @param {Array} posts - The array of posts.
 * @param {number} characters - The number of characters to display in the preview.
 * @param {string} postTemplatePath - The path to the post template.
 * @param {string} tempPostsOutputDirectory - The directory to save the generated files.
 */
export const generateIntermediatePostHtmlFiles = (
  posts,
  postTemplatePath,
  tempPostsOutputDirectory,
) => {
  ensureDirectoryExists(tempPostsOutputDirectory);

  posts.forEach((post) => {
    const templateContent = readFileContent(postTemplatePath);
    const dom = new JSDOM(templateContent);
    const document = dom.window.document;
    const postItemTemplate = document.querySelector('#post-content');
    const postItem = createPostItem(
      post,
      postItemTemplate,
      `../../${config.publicPostsOutputDirectory}`,
      `../../${config.publicTagsOutputDirectory}`,
    );
    const filesWithDash = post.htmlFileName.split(' ').join('-');
    const htmlContent = postItem.outerHTML;
    const outputPath = path.join(tempPostsOutputDirectory, filesWithDash);
    fs.writeFileSync(outputPath, htmlContent);
    console.log(`(Posts.js): Generated post -> ${outputPath}`);
  });
};
