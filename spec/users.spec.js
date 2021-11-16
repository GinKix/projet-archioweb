// Module dependencies
const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { cleanUpDatabase } = require('./utils');
const jwt = require('jsonwbebtoken')
const config = require('../config');

// Nettoyage + fermeture de la connexion à la BD à chaque test
beforeEach(cleanUpDatabase);
after(mongoose.disconnect);

function generateValidJwt(user){
    // Génération d'un JWT valide pendant 7 jours
    const exp = (new Date().getTime() + 7 * 24 * 3600 * 1000)/1000;
    const claims = { sub: user._id.toString(), exp: exp };
    return new Promise((resolve, reject) => {
        jwt.sign(claims, config.secretKey, function(err, token){
            if(err){
                return reject(err);
            }

            resolve(token);
        });
    });
}

describe('POST /api/person', function() {
  it('should create a user', async function(){
    const res = await supertest(app)
        .post('/api/person')
        .send({
            username: 'John Doe',
            password: '1234'
        })
        .expect(200)
        .expect('Content-Type', /json/);

    // Check that the response body is a JSON object with exactly the properties we expect.
    expect(res.body).to.be.an('object');
    expect(res.body._id).to.be.a('string');
    expect(res.body.name).to.equal('John Doe');
    expect(res.body).to.have.all.keys('_id', 'username');
  });
});

describe('GET /api/person', function() {
    // Insertion d'utilisateurs dans la BD test
    let user;
    beforeEach(async function(){
        const users = await Promise.all([
            user.create({ username: 'John Doe', password: '1234' }),
            user.create({ username: 'Jane Doe', password: '1234' })
        ]);

        // Retrouver un utilisateur
        user = users[0];
    });

    it('should retrieve the list of users');
    const token = await generateValidJwt(user);
    const res = await supertest(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/);

    expect(res.body).to.be.an('array');
    expect(res.body).to.have.lengthOf(2);

    expect(res.body[0]).to.be.an('object');
    expect(res.body[0]._id).to.be.a('string');
    expect(res.body[0].name).to.equal('Jane Doe');
    expect(res.body[0]).to.have.all.keys('_id', 'username');

    expect(res.body[1]).to.be.an('object');
    expect(res.body[1]._id).to.be.a('string');
    expect(res.body[1].name).to.equal('John Doe');
    expect(res.body[1]).to.have.all.keys('_id', 'username');
});

describe('PUT /api/person/:IdPerson', function(){
    it('should modify a user', async function(){
        const res = await supertest(app);

        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.name).to.equal('John Doe');
        expect(res.body).to.have.all.keys('_id', 'username');
    });
});

describe('DELETE /api/person/:IdPerson', function(){
    it('should delete a user', async function(){
        const res = await supertest(app);

        // Check that the response body is a JSON object with exactly the properties we expect.
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.name).to.not.equal('John Doe');
        expect(res.body).to.not.have.all.keys('_id', 'username');
    });
});