const https = require("https");
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

const { API_ROOT } = require('./config/proxy.js');
const httpsOptions = {
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  };

app.use(cors({
    origin: '*'
}));
app.use(express.json());

app.post('/:path(graphql|api)', async (req, res) => {
    const apiResponse = await fetch(
        [ API_ROOT, req.params.path ].join('/'),
        {
            ...httpsOptions,
            method: 'post',
            headers: req.headers,
            body: JSON.stringify(req.body),
        }
    );
    

    // console.log(await apiResponse.text());

    res.send(await apiResponse.json());
});

app.listen(4567, () => console.log(`Proxy server started on localhost:4567`));