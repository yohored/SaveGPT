  (async () => {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAaEKotZ0F4uKyWsufMcB6s46OWO_RSM-Y",
        authDomain: "chatgpt-34a1d.firebaseapp.com",
        projectId: "chatgpt-34a1d",
        storageBucket: "chatgpt-34a1d.appspot.com",
        messagingSenderId: "583333669815",
        appId: "1:583333669815:web:13797dddcc8f51435e1632",
        measurementId: "G-E3N89FKB7N"
    };

    firebase.initializeApp(firebaseConfig);

    // Get a reference to the Firestore service
    const db = firebase.firestore();

    // Rest of your popup.js code
    const saveButton = document.getElementById("saveButton");
    const titleInput = document.getElementById("title");
    const tagsInput = document.getElementById("tags");
    const conversationsDiv = document.getElementById("conversations");

    saveButton.addEventListener("click", async () => {
        const title = titleInput.value;
        const tags = tagsInput.value.split(",").map(tag => tag.trim());

        if (!title) {
            alert("Please enter a title.");
            return;
        }

        const conversation = {
            title,
            tags,
            content: "Your conversation with ChatGPT goes here.", // Replace with actual conversation content
            timestamp: firebase.firestore.Timestamp.now()
        };

        // Save the conversation to Firestore
        await db.collection("conversations").add(conversation);

        // Clear the input fields
        titleInput.value = "";
        tagsInput.value = "";

        // Update the conversations list
        displayConversation(conversation);
    });

    function displayConversation(conversation) {
        const conversationElement = document.createElement("div");
        conversationElement.classList.add("conversation");
        conversationElement.textContent = conversation.title;
        conversationsDiv.appendChild(conversationElement);
    }

    // Load saved conversations from Firestore
    db.collection("conversations").orderBy("timestamp", "desc").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            displayConversation(doc.data());
        });
    });

    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("searchButton");

    searchButton.addEventListener("click", async () => {
        const searchTerm = searchInput.value.trim();

        if (!searchTerm) {
            alert("Please enter a tag to search.");
            return;
        }

        // Clear the conversations list
        conversationsDiv.innerHTML = "";

        // Search for conversations with the specified tag
        const querySnapshot = await db.collection("conversations")
            .where("tags", "array-contains", searchTerm)
            .orderBy("timestamp", "desc")
            .get();

        querySnapshot.forEach((doc) => {
            displayConversation(doc.data());
        });
    });
})();

  

  

  
  