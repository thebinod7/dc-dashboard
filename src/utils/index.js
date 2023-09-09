import htmlToDraft from 'html-to-draftjs';
import { ContentState } from 'draft-js';

export const convertHtmlToEditorState = htmlContent => {
	const blocksFromHtml = htmlToDraft(htmlContent);
	const { contentBlocks, entityMap } = blocksFromHtml;
	const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
	return contentState;
};

export const createFormData = values => {
	let formData = new FormData();
	for (var key in values) {
		formData.append(key, values[key]);
	}
	return formData;
};
