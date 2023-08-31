document.addEventListener("DOMContentLoaded", function () {
    const postButton = document.getElementById("postButton");
    const imageButton = document.getElementById("imageButton");
    const videoButton = document.getElementById("videoButton");
    const postsContainer = document.getElementById("posts");
    const postTextArea = document.getElementById("postText");
    const userNameInput = document.getElementById("userName");
    let selectedImage = null;
    let selectedVideo = null;
  
    // Configuración de Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDdonhqWQaJNipvXzxn9uEn_fs36XanMvI",
        authDomain: "anecdotas-de-santos.firebaseapp.com",
        projectId: "anecdotas-de-santos",
        storageBucket: "anecdotas-de-santos.appspot.com",
        messagingSenderId: "874391477483",
        appId: "1:874391477483:web:7a84aad6d2149f33e0b2ae"
      };
  
    // Inicialización de Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();
    const storage = firebase.storage();
  
    imageButton.addEventListener("click", function () {
        if (postTextArea.value.trim() === "" || userNameInput.value.trim() === "") {
          alert("Por favor, agrega tu nombre y un comentario antes de cargar una imagen.");
          return;
        }
      
        const imageInput = document.createElement("input");
        imageInput.type = "file";
        imageInput.accept = "image/*";
        imageInput.style.display = "none";
      
        imageInput.addEventListener("change", function (event) {
          selectedImage = event.target.files[0];
      
          const imagePreview = document.getElementById("imagePreview");
          if (selectedImage) {
            const imageURL = URL.createObjectURL(selectedImage);
            imagePreview.innerHTML = `<img src="${imageURL}" alt="Vista previa de la imagen">`;
      
            // Subir imagen a Firebase Storage
            const imageRef = storage.ref().child(`images/${Date.now()}_${selectedImage.name}`);
            imageRef.put(selectedImage).then(snapshot => {
              imageRef.getDownloadURL().then(url => {
                // Ahora puedes usar 'url' para almacenar la URL de la imagen en la base de datos
              });
            });
          } else {
            imagePreview.innerHTML = "";
          }
        });
      
        document.body.appendChild(imageInput);
        imageInput.click();
        document.body.removeChild(imageInput);
      });
      
  
      videoButton.addEventListener("click", function () {
        if (postTextArea.value.trim() === "" || userNameInput.value.trim() === "") {
          alert("Por favor, agrega tu nombre y un comentario antes de cargar un video.");
          return;
        }
      
        const videoInput = document.createElement("input");
        videoInput.type = "file";
        videoInput.accept = "video/*";
        videoInput.style.display = "none";
      
        videoInput.addEventListener("change", async function (event) {
          const selectedVideoFile = event.target.files[0];
      
          if (selectedVideoFile) {
            const videoDuration = await getVideoDuration(selectedVideoFile);
            const maxDuration = 300; // 5 minutos en segundos
      
            if (videoDuration > maxDuration) {
              alert("El video es demasiado largo. Por favor, elige un video de máximo 5 minutos.");
              return;
            }
      
            selectedVideo = selectedVideoFile;
      
            const videoPreview = document.getElementById("videoPreview");
            const videoURL = URL.createObjectURL(selectedVideo);
            videoPreview.innerHTML = `<video src="${videoURL}" controls class="post-video"></video>`;
      
            // Subir video a Firebase Storage
            const videoRef = storage.ref().child(`videos/${Date.now()}_${selectedVideo.name}`);
            videoRef.put(selectedVideo).then(snapshot => {
              videoRef.getDownloadURL().then(url => {
                // Ahora puedes usar 'url' para almacenar la URL del video en la base de datos
              });
            });
          } else {
            selectedVideo = null;
            const videoPreview = document.getElementById("videoPreview");
            videoPreview.innerHTML = "";
          }
        });
      
        document.body.appendChild(videoInput);
        videoInput.click();
        document.body.removeChild(videoInput);
      });
      
  
      postButton.addEventListener("click", function () {
        const postText = postTextArea.value;
        const userName = userNameInput.value.trim();
      
        if (postText !== "" && userName !== "") {
          const reader = new FileReader();
      
          reader.onload = function (event) {
            const imageData = selectedImage ? event.target.result : null;
            const videoData = selectedVideo ? event.target.result : null;
      
            // Crear la entrada en la base de datos
            const postsRef = database.ref("posts");
            const newPostRef = postsRef.push();
            newPostRef.set({
              userName: userName,
              text: postText,
              imageData: imageData,
              videoData: videoData
            });
      
            // Limpiar campos y vista previa
            postTextArea.value = "";
            userNameInput.value = "";
            const imagePreview = document.getElementById("imagePreview");
            imagePreview.innerHTML = "";
            const videoPreview = document.getElementById("videoPreview");
            videoPreview.innerHTML = "";
            selectedImage = null;
            selectedVideo = null;
          };
      
          if (selectedImage) {
            reader.readAsDataURL(selectedImage);
          } else if (selectedVideo) {
            reader.readAsDataURL(selectedVideo);
          } else {
            reader.onload(); // Llamar directamente si no hay imagen ni video
          }
        }
      });
      
  
      function createPost(userName, text, imageData, videoData) {
        const postElement = document.createElement("div");
        postElement.className = "post";
      
        let postContent = `<p><strong>${userName}:</strong> ${text}</p>`;
      
        if (imageData) {
          postContent += `<img src="${imageData}" alt="Publicación de ${userName}" class="post-image">`;
        }
      
        if (videoData) {
          postContent += `<video src="${videoData}" controls class="post-video"></video>`;
        }
      
        postContent += `
          <div class="post-actions">
            <button class="likeButton">Me gusta</button>
            <div class="likes">0</div>
          </div>
          <div class="comments">
            <ul class="comment-list"></ul>
            <input type="text" class="comment-input" placeholder="Escribe un comentario">
            <button class="commentButton">Comentar</button>
          </div>`;
      
        postElement.innerHTML = postContent;
      
        const commentButton = postElement.querySelector(".commentButton");
        commentButton.addEventListener("click", function () {
          const commentInput = postElement.querySelector(".comment-input");
          const commentText = commentInput.value;
          const userName = userNameInput.value.trim();
      
          if (commentText !== "" && userName !== "") {
            createComment(postElement, commentText, userName);
            commentInput.value = "";
          }
        });
      
        const likeButton = postElement.querySelector(".likeButton");
        const likesCount = postElement.querySelector(".likes");
      
        let likes = 0;
        let liked = false;
        likeButton.addEventListener("click", function () {
          if (!liked) {
            likes++;
            likesCount.textContent = likes;
            liked = true;
          }
        });
      
        if (postsContainer.firstChild) {
          postsContainer.insertBefore(postElement, postsContainer.firstChild);
        } else {
          postsContainer.appendChild(postElement);
        }
      }
      
  
      function createComment(postElement, commentText, userName) {
        const commentsList = postElement.querySelector(".comment-list");
        const commentElement = document.createElement("li");
        commentElement.innerHTML = `<strong>${userName}:</strong> ${commentText} <button class="replyButton">Responder</button> <ul class="reply-list"></ul> <input type="text" class="reply-input" placeholder="Escribe una respuesta"> <button class="replySubmitButton">Enviar</button>`;
        commentsList.appendChild(commentElement);
      
        const replyButton = commentElement.querySelector(".replyButton");
        const replyList = commentElement.querySelector(".reply-list");
        const replyInput = commentElement.querySelector(".reply-input");
        const replySubmitButton = commentElement.querySelector(".replySubmitButton");
      
        replyButton.addEventListener("click", function () {
          replyList.classList.toggle("show");
          replyInput.classList.toggle("show");
          replySubmitButton.classList.toggle("show");
        });
      
        replySubmitButton.addEventListener("click", function () {
          const replyText = replyInput.value;
          if (replyText !== "") {
            createReply(replyList, replyText, userName);
            replyInput.value = "";
            replyList.classList.remove("show");
            replyInput.classList.remove("show");
            replySubmitButton.classList.remove("show");
          }
        });
      
        // Crear comentario en la base de datos
        const commentsRef = database.ref("comments");
        const newCommentRef = commentsRef.push();
        newCommentRef.set({
          postId: postElement.id,
          userName: userName,
          text: commentText
        });
      }
      
  
      function createReply(replyList, replyText, userName) {
        const replyElement = document.createElement("li");
        replyElement.innerHTML = `<strong>${userName} (respuesta):</strong> ${replyText}`;
        replyList.appendChild(replyElement);
      
        // Crear respuesta en la base de datos
        const repliesRef = database.ref("replies");
        const newReplyRef = repliesRef.push();
        newReplyRef.set({
          commentId: replyList.parentElement.id,
          userName: userName,
          text: replyText
        });
      }
      
    
    // Escucha cambios en la base de datos y actualiza el muro
    const postsRef = database.ref("posts");
    postsRef.on("child_added", function(snapshot) {
      const post = snapshot.val();
      createPost(post.userName, post.text, post.imageData, post.videoData);
    });
  });
  