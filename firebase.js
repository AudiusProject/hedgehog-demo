class Firebase {
  constructor() {
    var config = {
      apiKey: "AIzaSyBM_bvGpHJeA3Wn5xeQMKNiQi5mkCNaS7E",
      authDomain: "hedgehog-dev-30d41.firebaseapp.com",
      databaseURL: "https://hedgehog-dev-30d41.firebaseio.com",
      projectId: "hedgehog-dev-30d41",
      storageBucket: "hedgehog-dev-30d41.appspot.com",
      messagingSenderId: "247267429112"
    };
    
    this.app = firebase.initializeApp(config);
    this.db = firebase.firestore(this.app);
  }

  async writeToFirebase(data) {
    try{
      await this.db.collection("Authentications").doc(data.lookupKey).set(data)
      console.log("Document successfully written!");
    }
    catch(e){
      console.error("Error writing document: ", e);
    }
  }

  async createIfNotExists(data){
    try{
      var docRef = await this.db.collection("Authentications").doc(data.lookupKey).get();
      if(docRef.exists){
        throw new Error(`Document exists for lookupKey ${data.lookupKey}`)
      }
      else{
        return this.writeToFirebase(data)
      }
    }
    catch(e){
      throw e
    }
  }
  
  // This should be turned off by default because permissions for "list" have been turned off
  // can be turned on for debugging purposes
  async readAllFromFirebase() {
    try{
      let data = await this.db.collection("Authentications").get()
  
      for(var i = 0; i < data.docs.length; i++){
        console.log(data.docs[i].data())
      }
    }
    catch(e){
      throw e
    }
  }
  
  async readRecordFromFirebase(lookupKey) {
    try{
      var docRef = await this.db.collection("Authentications").doc(lookupKey).get();
      return docRef.data()
    }
    catch(e){
      throw e
    }
  }
}

window.Firebase = Firebase