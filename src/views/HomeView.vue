<template>
  <div class="text-center my-3">
     <button
        type="button"
        class="btn btn-sm btn-primary"
        @click="createImage"
      >
        <i class="fa fa-plus-square"></i>
        Agregar
      </button>
  </div>
  <div class="container my-3">
    <div class="table-responsive">
      <table class="table-bordered table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titulo</th>
            <th>Imagen</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
         <tr v-for="(imagen, index) in imagenes" :key="index">
            <td>{{index+1}}</td>
            <td>{{imagen.title}}</td>
            <td>
                <img :src="`${urlImage}/${imagen.image}`" alt="Imagen" style="width:76px;height:76px" />
            </td>
            
            <td>
              <button @click="editImagen(imagen)" class="btn btn-info">Editar</button>
            </td>
            <td>
              <button class="btn btn-danger">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>


  <!-- Modal -->
      <div
        class="modal fade"
        id="imagenModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="imagenModal"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" v-show="!editMode">Agregar Imagen</h5>
              <h5 class="modal-title" v-show="editMode">Actualizar Imagen</h5>
              <button
                @click="cerrarModal"
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

             <div class="card">
                  <div class="card-header">
                      <h3>Crear Nuevo</h3>
                  </div>
                  <div class="card-body">
                      <form action="" @submit.prevent="editMode ? updateImagen() : storeImagen()">
                          <div class="my-2">
                              <label for=""><b>Title</b></label>
                              <input
                                type="text" 
                                v-model="imageData.title"
                                class="form-control"
                              />
                              <span class="text-danger" v-show="imageErrors.title">Title es requerido</span>
                          
                          </div>
                          <div class="my-2">
                              <label for=""><b>Image</b></label>
                              <input type="file" id="imagen_file" @change="selectedImagenFile" class="form-control">
                               <input type="hidden" v-model="imageData.imagen" />
                                <img v-if="editMode" :src="`http://localhost:8000/fotos-subidas/${imageData.imagen}`" alt="Imagen" style="width:70px;height:70px" />
                                <span class="text-danger" v-show="imageErrors.image">image es requerido</span>
                          </div>
                         
                            <button v-show="editMode" type="submit" class="btn btn-success">
                              Actualizar
                            </button>
                            <button
                              v-show="!editMode"
                              type="submit"
                              class="btn btn-primary"
                            >
                              Agregar
                            </button>
                      </form>
                  </div>
              </div>

            
          </div>
        </div>
      </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

export default {
  name: 'HomeView',
  data(){
    return{
      editMode: false,
      subEditMode: false,
      deleteMode: false,

      imageData: {
         id: '',
          title: '',
          image: '',
      },

      imageErrors:{
        title: false,
        image:false
      },
     

      imagenes:{},
      subImagenDatas:[],
      subImagenErrors:[],
      sub_imagenes: {},
      url:'http://localhost:8000/api/',
      urlImage: 'http://localhost:8000/fotos-subidas',
      new_image:''
      
    }
  },
  methods: {
    createImage(){
      this.deleteMode = false
      this.editMode = false
      this.imageData = {
        id: '',
        title: '',
        image: ''
      }

      document.querySelector('#imagen_file').value = '';


      $('#imagenModal').modal('show')
      

      },
      getImagenes(){
        const t = this
        setTimeout(function(){
          axios.get(t.url + 'get').then(response =>{
            console.log(response)
            t.imagenes = response.data
            console.log(t.imagenes)
          }).catch(errors => {
            console.log(errors)
          });
        },1000)
      },
      deleteImagen(){
        axios.post(this.url + '/deleteImagen/' + this.imageData.id).then(response =>{
          this.getImagenes()
          console.log(response)
        }).catch(errors => {
          console.log(errors)
        }).finally(()=>{
          $('#imagenModal').modal('hide')
        });
       
    },
    removeImagen(imagen){
      this.deleteMode = true
      this.imageData.id = imagen.id
      $('#imagenModal').modal('show')
    },
    updateImagen(){
      this.imageData.title == '' ? this.imageErrors.title = true : this.imageErrors.title = false
       const formdata = new FormData();
        formdata.append('title',this.imageData.title);
        formdata.append('image',this.imageData.image);
        formdata.append('new_image',this.new_image);
      if(this.imageData.title ){
        axios.post(this.url + 'update/' + this.imageData.id, formdata)
        .then(response => {
          console.log(response)
          this.getImagenes()
        }).catch(errors => {
          console.log(errors)
        }).finally(() => {
          console.log("cierra")
          $('imagenModal').modal('hide');
          console.log("no cierra")
        });
      }

    },
    editImagen(imagen){
      console.log(imagen)
      this.deleteMode = false
      this.editMode = true
      this.imageData = {
        id: imagen.id,
        title: imagen.title,
        imagen: imagen.image,
      }
      this.imageErrors = {
        title: false,
      }
      $('#imagenModal').modal('show')
    },

    createImagen(){
      this.deleteMode = false
      this.editMode = false
      this.imageData = {
        id: '',
        title: '',
        imagen: '',
      }
      document.querySelector('#imagen_file').value = '';

      this.imageErrors = {
        title: false,
        image: false
      }
      $('#imagenModal').modal('show')
    },

    storeImagen(){
       this.imageData.title == '' ? this.imageErrors.title = true : this.imageErrors.title = false
       this.imageData.image == '' ? this.imageErrors.image = true : this.imageErrors.image = false
       const formdata = new FormData();
        formdata.append('title',this.imageData.title);
        formdata.append('image',this.imageData.image);
      if(this.imageData.title){
          axios.post(this.url + 'create/', formdata)
          .then(response => {
            console.log(response)
            this.getImagenes()
          }).catch(errors => {
            console.log(errors)
          }).finally(() => {
            $('imagenModal').modal('hide')
          });
        }
      },

      selectedImagenFile(e){
          if(this.editMode)
             this.new_image = e.target.files[0]
          else
            this.imageData.image = e.target.files[0]
           
        
      },

      showSubImagen(imagen){
        this.subEditMode = false
        this.sub_imagenes = imagen.sub_imagenes
        this.subImagenDatas = {
          id: '',
          imagen_id: imagen.id,
          title: ''
        }
      },

      cerrarModal(){
        console.log("no anda")
        $('imagenModal').modal('hide')
         console.log("no anda2")
      }


    },


  mounted(){
    this.getImagenes()
  }
}
</script>
