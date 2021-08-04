const list=document.querySelector('#list')
const form=document.querySelector('form')
const btn=document.querySelector('button')
const addRecipe=(recipe,id)=>{
 let time=   recipe.created_at.toDate()

 let html=`
 <li data-id="${id}"> <div> ${recipe.title}</div>
      <div style="font-weight: bold; color: blue"> ${time}</div>
      <button class="btn btn-danger my-1"> delete</button>
 </li>
 
 `
    list.innerHTML+=html
    form.recipe.value=null
}
const deleteRecipe=(id)=>{
    const recipes=document.querySelectorAll('li')
    recipes.forEach(recipe=>{
        if(recipe.getAttribute('data-id')===id){
            recipe.remove()
        }
    })
}
   //Get
// db.collection('recipes').get().then((datas)=>{
//   datas.docs.forEach(doc=>{
//       addRecipe(doc.data(),doc.id)
//   })
// }).catch(err=>{
//     console.log(err)
// })
 const unsub=db.collection('recipes').onSnapshot(snapshot=>{
     snapshot.docChanges().forEach(change=>{
         const doc=change.doc
         if(change.type==='added'){
             addRecipe(doc.data(),doc.id)
         }
         else if(change.type==='removed'){
             deleteRecipe(doc.id)
         }
     })
 })

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const now =new Date()
    const recipe={
        title:form.recipe.value,
        created_at:firebase.firestore.Timestamp.fromDate(now)

    }
    db.collection('recipes').add(recipe).then(()=>{
        console.log("added")
    }).catch(err=>{
        console.log(err)
    })


})
list.addEventListener('click',(e)=> {
    if(e.target.tagName==='BUTTON'){
        const id=e.target.parentElement.getAttribute('data-id')
        db.collection('recipes').doc(id).delete()
            .then(()=>{
                console.log("deleted")

            })
    }
})
btn.addEventListener('click',()=>{
    unsub()
})