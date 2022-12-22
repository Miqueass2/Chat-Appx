import { dataBase, rtdb } from "./db";
import * as express from "express";
import { nanoid } from "nanoid";
import * as cors from "cors";
import * as bodyParser from "body-parser";
const port = process.env.PORT || 1200;
const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

/* sign up */
/* auth */
const usersColecction = dataBase.collection("users"); 
const roomsColecction = dataBase.collection("rooms");

app.post("/signup", (req, res) => {
   const email = req.body.email;
   const name = req.body.name;
   /* con .where le digo que se fije si hay un email igual al que me pasaron */
   /* y le hago un get para obtener la respuesta que nos devuelve una promesa */
   usersColecction.where("email", "==", email)
      .get()
      .then((response) => {
         /* con el response.empy chequeo , si esta vacio(true).. crea uno agregando metodo add */
         /* sino le envio un status code que ya existre */
      if(response.empty) {
         usersColecction.add({
            email,
            name
         }).then((newUser) => {
            res.json({
               id: newUser.id,
               new: true,
            });
            /* console.log("newuserId ",newUser.id); */
            
         });
      } else {
         res.status(400).json({
            message: "error , ya existe.",
            
         });
      };
   });
   /* usersColecction.doc("wQuUOKO2pIMr16MxuDag"); */
});

app.post("/auth", (req, res) => {
   /* poniendo email como objeto dentro de una constante..lo que hacemos es extraer
   de req.body el email. haciendo asi const {email} */
   const { email } = req.body
   /* console.log("soy req.body",req.body); */
   
   usersColecction.where("email", "==", email)
      .get()
      .then((responseSearch) => {
/*          console.log("response docs[0]",responseSearch.docs[0]);
         console.log("response docs[0].id",responseSearch.docs[0].id);
         console.log("response docs.data",responseSearch.docs[0].data());
 */         
         if (responseSearch.empty) {
            res.status(400).json({
               message: "el email ingresado no existe",
            
            });
         } else {
            res.json({
               //esto devulve el id de usersCollection
               id: responseSearch.docs[0].id
            })
            /* console.log("soy responseSearch",responseSearch.docs[0].id); */
            
         };
      });
});

/* app.get("/rooms/:roomId", (req,res) => {
   const { roomId } = req.body;

   roomsColecction.doc(roomId).get().then((snap) => {
      const data = snap.data();
      console.log("existo",data);

      res.json("existe")
      res.status(401).json("no existis")
   })

}); */

app.post("/rooms", (req, res) => {

   //este userId es el id del user que se creo en createUser
   //y le respondemos el id
   const { userId } = req.body;


   usersColecction.doc(userId.toString())
      .get()
      .then((snapshot) => {
         //se fija si existe el id en users,
         //si es asi crea room en Rooms con ese id de users

         //aca en el log me muestra un obj con los datos
         /* ej:{ email: 'meke@gmail.com', name: 'meke' } */
         /* console.log(snapshot.data()); */
         
         if (snapshot.exists) {
         const roomRef = rtdb.ref("rooms/"+ nanoid())
         roomRef.set({
            messages: [],
            owner: userId
         }).then(() => {
            const roomLongNanoId = roomRef.key;
            /* console.log("soy roomlong nanoId",roomLongNanoId); */
            const roomId = 1000 + Math.floor(Math.random() * 999);
         //ACA CREAMOS UN NUEVO ROOM ID EN DB ROOMS COLLECTION
         //CON EL VERDADERO ROOM LARGO ADENTRO
            roomsColecction.doc(roomId.toString()).set({
               rtdbRoomId:roomLongNanoId,
            }).then(() => {
               
               res.json({
                  id: roomId.toString()
               })
            })
         })
      } else {
         res.status(401).json({
            message:"no existis"
         })
      }
      });
   
});

app.get("/rooms/:roomId",(req,res)=>{
   const { userId }:any = req.query
   const {roomId} = req.params

   usersColecction.doc(userId.toString())
      .get()
      .then((snapshot) => {
         if (snapshot.exists) {
            roomsColecction.doc(roomId).get().then(snap => {
               if (snap.exists) {
                  const data = snap.data()
                  //ACA EN DATA ESTA EL NANO ID QUE LO VI POR LOG
                  //console.log("soy data room/:roomId ",data);
                  
                  res.json(data)
                  
               } else {
                  res.status(401).json({
                     message:"Room no existente",
                  })
               }
            
            });
            roomsColecction.doc(roomId).get
            console.log();
            
      } else {
            res.status(401).json({
               message: "no existis"
            });
      }
      });
   
});

app.post("/rooms/:id", (req, res) => {
   const chatRoomRef = rtdb.ref("/rooms/" + req.params.id + "/messages");
   chatRoomRef.on("value", (snap) => {
      let value = snap.val();
      //aqui value me  devuelve un obj de el rooms id rtdb y dentro de ese obj..
      //otro objt donde esta {from: "name", message:"hola"}
      /* console.log("soy value snap",value); */
      
   });
   chatRoomRef.push(req.body, () => {
      res.json("todo ok");
   });
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
   res.sendFile(__dirname + "/dist/index.html");
})

app.listen(port, () => {
   console.log(process.env.PORT_OK);
   console.log(`port ok http://localhost:${port}`);
})