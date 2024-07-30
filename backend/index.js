const sendSms = require('./send.js');

const config = {
	domain: '<2v558z.api.infobip.com>',
	apiKey: '11c55286df3a67f2c6177ff420dfe66a-a79fc9cb-da89-497a-8d90-4b7248cde8b2'
}

sendSms(config,'<9267909683>', `hello world at ${new Date()}` ).then(result => console.log(result));