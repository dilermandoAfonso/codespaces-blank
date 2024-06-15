var jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('')[1]
    if (token == null) {
        return res.status(401).send({ error: 'Token não encontrado'})
    } else {
        jwt.verify(token, '881fca48c92a98295aaaeee18c6f1425d00f59298f0b085a01c51cb2329d4cb2', (err, user) => {
            if (err) {
                return res.status(403).send({ error: 'Token inválido' })
            } else {
                req.user = user
                next()
            }
        })
    }
}

module.exports = authenticateToken;