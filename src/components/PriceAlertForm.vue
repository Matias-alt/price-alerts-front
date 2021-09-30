<template>
  <div>
    <form class="form-alert">
        <h3 v-if="!edit">Crear Alerta de Precio</h3>
        <h3 v-if="edit">Editar Alerta de Precio</h3>
        <div class="form-group">
            <input v-if="!edit" type="text" class="form-control" id="name" placeholder="Nombre">
            <input v-if="edit" :value="alertForm.name" type="text" class="form-control" id="name" placeholder="Nombre">
        </div>
        <div class="form-group">
            <select id="origin" class="form-control" v-model="alertForm.origin" @change="changeOrigin($event)">
                <option v-for="city in cities" v-bind:key="city.id" v-bind:value="city.id">
                    {{city.name}}
                </option>
            </select>
        </div>
        <div class="form-group">
            <select id="destiny" class="form-control" v-model="alertForm.destiny" @change="changeDestiny($event)">
                <option v-for="city in cities" v-bind:key="city.id" v-bind:value="city.id">
                    {{city.name}}
                </option>
            </select>
        </div>
        <div class="form-group">
            <select id="travelClass" class="form-control" @change="changeClass($event)">
                <option v-if="alertForm.travelClass != null" disabled selected>{{alertForm.travelClass}}</option>
                <option v-if="alertForm.travelClass == null" disabled selected>Clase</option>
                <option value="1">Premium</option>
                <option value="2">Salon Cama</option>
                <option value="3">Semi Cama</option>
                <option value="4">Pullman</option>
            </select>
        </div>
        <div class="form-group">
            <input v-if="!edit" type="number" class="form-control" id="price" placeholder="Precio">
            <input v-if="edit" :value="alertForm.price" type="number" class="form-control" id="price" placeholder="Precio">
        </div>
        
        <div class="calendar">
            <v-date-picker v-model="date">
                <template v-slot="{ inputValue, inputEvents }">
                    <input 
                    class="bg-white border px-2 py-1 rounded"
                    :value="inputValue"
                    v-on="inputEvents"
                    />
                </template>
            </v-date-picker>
        </div>

        <div class="form-group">
            <div v-if="edit" class="cont-edit-btn">
                <button v-on:click="cleanForm" type="submit" class="w-100 btn btn-warning ">Cancelar</button>
                <button v-on:click="editPriceAlert" type="submit" class="w-100 btn btn-primary ">Editar</button>
            </div>
            <div v-else>
                <button v-on:click="addPriceAlert" type="submit" class="w-100 btn btn-primary ">Agregar</button>
            </div>
        </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'PriceAlertForm',
  
  data () {
    return {
      loading: false,
      cities: [],
      cmb_cities_des: 0,
      cmb_cities_ori: 0,
      date: new Date(),

      class_id: null,
      class_name: null,

      origin_id: null,
      origin_name: null,

      destiny_id: null,
      destiny_name: null,

    }
  },
  mounted () {
    this.loading = true;
    axios.get('https://price-alerts-api.herokuapp.com/api/v1/cities')
    .then(response => {
        this.cities = response.data.cities
    })
    .catch(error => console.log(error))
    .finally(() => this.loading = false)
  },
  methods: {
    changeOrigin(e){
        this.origin_id = e.target.value
        this.origin_name = e.target.options[e.target.options.selectedIndex].text;
    },

    changeDestiny(e){
        this.destiny_id = e.target.value
        this.destiny_name = e.target.options[e.target.options.selectedIndex].text;
    },

    changeClass(e){
        this.class_id = e.target.value
        this.class_name = e.target.options[e.target.options.selectedIndex].text;
    },

    addPriceAlert(e){
        e.preventDefault();

        const name = document.querySelector('#name').value
        const price = document.querySelector('#price').value

        var dd = String(this.date.getDate()).padStart(2, '0');
        var mm = String(this.date.getMonth() + 1).padStart(2, '0');
        var yyyy = this.date.getFullYear();
        this.date = dd + '-' + mm + '-' + yyyy;

        axios({
            method: 'post',
            url: 'https://price-alerts-api.herokuapp.com/api/v1/price_alerts',
            data: {
                name: name,
                origin: `{"name":"${this.origin_name}", "id":${this.origin_id}}`,
                destiny: `{"name":"${this.destiny_name}", "id":${this.destiny_id}}`,
                departure_date: this.date,
                travelClass: `{"name":"${this.class_name}", "id":${this.class_id}}`,
                price: price
            }
        })
        .then(response => {
            console.log(response);
            this.cleanForm();
            Swal.fire('Has creado una alerta de precio exitosamente', '', 'success');
            this.$root.$emit('my_event', false);
        })
    },

    editPriceAlert(e){
        e.preventDefault();
        const name = document.querySelector('#name').value
        const price = document.querySelector('#price').value
        
        var dd = String(this.date.getDate()).padStart(2, '0');
        var mm = String(this.date.getMonth() + 1).padStart(2, '0');
        var yyyy = this.date.getFullYear();
        this.date = dd + '-' + mm + '-' + yyyy;

        axios({
            method: 'put',
            url: `https://price-alerts-api.herokuapp.com/api/v1/price_alerts/${this.id}`,
            data: {
                name: name,
                origin: `{"name":"${this.origin_name}", "id":${this.origin_id}}`,
                destiny: `{"name":"${this.destiny_name}", "id":${this.destiny_id}}`,
                departure_date: this.date,
                travelClass: `{"name":"${this.class_name}", "id":${this.class_id}}`,
                price: price
            }
        })
        .then(response => {
            this.cleanForm();
            Swal.fire('Alerta de precio editada exitosamente', '', 'success');
            console.log("ESTOY AQUI");
            console.log(response);
            this.$root.$emit('my_event', false);
        })
    },

    cleanForm(){
        document.querySelector('#name').value = ''
        document.querySelector('#origin').value = ''
        document.querySelector('#destiny').value =''
        document.querySelector('#travelClass').value = ''
        document.querySelector('#price').value = ''
    }

  },
  props: {
    edit: Boolean,
    id: Number,
    alertForm: Object
  }
}
</script>

<style scoped>
.form-alert{
    border-radius: 10px;
    padding: 30px 10px;
    background-color: rgba(255, 255, 255, 0.363);
    width: 100%;
}

.form-alert div{
    margin: 15px;
}

.cont-edit-btn{
    display: grid;
    grid-template-columns: 40% 60%;
    column-gap: 10px;
}

h3{
    color: rgb(18, 57, 129);
    margin-bottom: 30px;
}
.calendar input{
    padding-top: 7px!important;
    padding-bottom: 7px!important;
    width: 100%!important;
}

</style>
