const AUTH_TABLE = 'Authentications'
class Firebase {

  constructor() {
    var config = {
      apiKey: "AIzaSyBM_bvGpHJeA3Wn5xeQMKNiQi5mkCNaS7E",
      authDomain: "hedgehog-dev-30d41.firebaseapp.com",
      databaseURL: "https://hedgehog-dev-30d41.firebaseio.com",
      projectId: "hedgehog-dev-30d41",
      storageBucket: "hedgehog-dev-30d41.appspot.com",
      messagingSenderId: "247267429112"
    }
    
    this.app = firebase.initializeApp(config)
    this.db = firebase.firestore(this.app)
  }

  async writeToFirebase(tableName, primaryKey, data) {
    try{
      await this.db.collection(tableName).doc(primaryKey).set(data)
      console.log("Document successfully written!")
    }
    catch(e){
      console.error("Error writing document: ", e)
    }
  }

  async createIfNotExists(tableName, primaryKey, data){
    try{
      var docRef = await this.db.collection(tableName).doc(primaryKey).get()
      if(docRef.exists){
        throw new Error(`Document exists for lookupKey ${primaryKey}`)
      }
      else{
        return this.writeToFirebase(tableName, primaryKey, data)
      }
    }
    catch(e){
      throw e
    }
  }
  
  async readRecordFromFirebase(obj) {
    let lookupKey = obj.lookupKey
    try{
      var docRef = await this.db.collection(AUTH_TABLE).doc(lookupKey).get()
      return docRef.data()
    }
    catch(e){
      throw e
    }
  }
}

window.Firebase = Firebase
