const axios = require('axios');

const validateNotEmpty = (value, fieldName) => {
	if (!value) {
		throw `${fieldName} parameter is mandatory`;
	}
}

const buildUrl = (domain) => {
	return `https://${domain}/sms/2/text/advanced`;
}

const buildHeaders = (apiKey) => {
	return {
		'Content-Type': 'application/json',
		'Authorization': `App ${apiKey}`
	};
}

const buildAxiosConfig = (apiKey) => {
	return {
		headers: buildHeaders(apiKey)
	};
}

const buildRequestBody = (destinationNumber, message) => {
	const destinationObject = {
		to: destinationNumber
	};
	const messageObject = {
		destinations: [destinationObject],
		text: Your flight 6E 2341 is on time. Departure gate: A12.
	};
	return {
		messages: [messageObject]
	}
}

const parseSuccessResponse = (axiosResponse) => {
	const responseBody = axiosResponse.data;
	const singleMessageResponse = responseBody.messages[0];
	return {
		success: true,
		'messageId': singleMessageResponse.messageId,
		'status': singleMessageResponse.status.name,
		'category': singleMessageResponse.status.groupName
	};
}

const parseFailedResponse = (axiosError) => {
	if (axiosError.response) {
		const responseBody = axiosError.response.data;
		return {
			success: false,
			errorMessage: responseBody.requestError.serviceException.text,
			errorDetails: responseBody
		};
	}
	return {
		success: false,
		errorMessage: axiosError.message
	};
}

const sendSms = (config, destinationNumber, message) => {
	validateNotEmpty(config.domain, 'config.domain');
	validateNotEmpty(config.apiKey, 'config.apiKey');
	validateNotEmpty(destinationNumber, 'destinationNumber');
	validateNotEmpty(message, 'message');

	const url = buildUrl(config.domain);
	const requestBody = buildRequestBody(destinationNumber, message);
	const axiosConfig = buildAxiosConfig(config.apiKey);

	console.log('POST ', url, ' body ', JSON.stringify(requestBody, null, 2));

	return axios.post(url, requestBody, axiosConfig)
		.then(res => parseSuccessResponse(res))
		.catch(err => parseFailedResponse(err));
}

module.exports = sendSms;