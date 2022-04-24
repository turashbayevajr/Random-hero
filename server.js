const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
const https = require("https");
const {stringify} = require("nodemon/lib/utils");
const tools = require("./alert.js");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/registration', (req, res) => {
    res.render('pages/registration');
})
app.post("/registration", function (req, res) {
    const email = req.body._email;
    const pass = req.body._pass;
    const name = req.body._name;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    PASSWORD: pass,
                    NAME:name
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/39a952edc1";
    const options = {
        method: "POST",
        auth:"nur:c529b24734a0ceff71347dd48ca7c6bb-us14"
    }

    const request = https.request(url, options, function (responce) {
        if(responce.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else res.sendFile(__dirname + "/error.html");
        responce.on("data", function (data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
})


//Sign in
app.post("/signIn", function (req, res) {
    const email = req.body._emailS;
    const pass = req.body._passS;

    const mailchimp = require("@mailchimp/mailchimp_marketing")
    const md5 = require("md5")
    mailchimp.setConfig({
        apiKey: 'c529b24734a0ceff71347dd48ca7c6bb-us14',
        server: 'us14',
    });
    const subscriber_hash = md5(email.toLowerCase());
    const list_id = '39a952edc1';

    const run = async () => {
        try {
            const response = await mailchimp.lists.getListMember(
                list_id,
                subscriber_hash
            );
            console.log(response.status);
            if (response.status === "subscribed") {
                if (response.merge_fields.PASSWORD === pass) {
                    res.render('pages/clientPage',{
                        name:response.merge_fields.NAME
                    });
                } else {
                    res.redirect(req.originalUrl);
                    var tools = require("./alert.js");
                    tools.sum();
                }
            }
        } catch (error) {
            res.sendFile(__dirname + "/error.html")
            console.log("Wrong email");
        }
    };

    run();

})
app.get('/', (req, res) => {
    res.render('pages/index');
})

app.get('/about',((req, res) => {
    res.render('pages/about');
}))
app.get('/cyber',((req, res) => {
    res.render('pages/cyber');
}))
app.get('/csgo',((req, res) => {
    res.render('pages/csgo');
}))
app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening at http://localhost:${port}`);
})

//c1f4858f4dde9a347037aed056b159fb-us14
//c529b24734a0ceff71347dd48ca7c6bb-us14

//id
//39a952edc1

// https://shopmates.herokuapp.com/registration