const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');

const s3 = new AWS.S3({
	credentials: {
		accessKeyId: keys.accessKeyId,
		secretAccessKey: keys.secretAccessKey,
	},
	region: 'us-east-2',
});

module.exports = (app) => {
	app.get('/api/upload', requireLogin, (req, res) => {
		const key = `${req.user.id}/${uuid()}.jpeg`;
		s3.getSignedUrl(
			'putObject',
			{
				Bucket: 'advancednodejs-blogs',
				ContentType: 'image/jpeg',
				Key: key,
			},
			(err, url) => {
				if (err) {
					return res.status(500).send({ error: 'Erro ao gerar URL' });
				}
				res.send({ key, url });
			}
		);
	});
};
