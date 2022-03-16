const express=require('express')
const app= express()
const socketio = require('socket.io')
const cors=require('cors')
const http=require('http')
const server =http.createServer(app)
const io=socketio(server)
app.use(cors())

app.get('/', function(req, res){
res.send("Messenger is Working")
})
io.on('connection', socket => {
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach(recipient => {
      const newRecipients = recipients.filter(r => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients, sender: id, text
      })
    })
  })
})

io.listen(5000)