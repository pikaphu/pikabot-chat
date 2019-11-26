const processMessage = require('./process-message');

module.exports = (req, res) => {
    console.log(req.body.object);
    if (req.body.object === 'page') {

        try {
            console.log('1:\n', req.body.entry);

            for (const entry of req.body.entry) {
                console.log('2:\n', entry);

                for (const event of entry.messaging) {
                    console.log('3:\n', event);

                    if (event.message && event.message.text) {
                        processMessage(event);
                    }
                }
            }
            // req.body.entry.forEach(entry => {
            //     entry.messaging.forEach(event => {
            //         if (event.message && event.message.text) {
            //             processMessage(event);
            //         }
            //     });
            // });
        } catch (error) {
            console.log('Error:', error);
        }


        res.status(200).end();
    }
};