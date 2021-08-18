
const socket = io('/')

const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
  })
let myVideoStream;
const peers = {}
const myVideo = document.createElement('video')
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    console.log(stream )
    
    myPeer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream  => {
           console.log(userVideoStream )
          addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        setTimeout(function () {
          connectToNewUser(userId, stream)
    
        }, 1000);
      })
    

    // socket.on('user-connected', (userId)=> {
    //     connectToNewUser(userId,stream);
    //   })
})
      let text = $("input");
      // when press enter send message
      $('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
        //    console.log(text.val()) 
          socket.emit('message', text.val());
          text.val('')
        }
      });
      socket.on("createMessage", message => {
          console.log("createMessage", message)
        $(".messages").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
      })
    
// })
// socket.emit('join-room',ROOM_ID)

myPeer.on('open', id => {
    console.log(id)
    socket.emit('join-room',ROOM_ID,id)
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  });




// socket.emit('join-room',ROOM_ID)
// socket.on('user-connected', (userId)=> {
//     connectToNewUser(userId,stream)
//   })

  function connectToNewUser(userId,stream) {
      console.log("nati front",userId)
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
      })
    
    peers[userId] = call
}


function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }


const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  
  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }