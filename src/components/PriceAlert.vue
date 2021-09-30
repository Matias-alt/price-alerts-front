<template>
  <div class="cont-alerts">
    <div class="cont-table-alerts">

      <h3>Tus alertas de precio</h3>
      <Loader v-if="loading"></Loader>

      <div v-else>
        <table  class="table-alerts">
          <tr>
            <th>Nombre</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha viaje</th>
            <th>Clase</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>

          <tr v-for="alert in all_alerts" v-bind:key="alert.id">
            <td>{{alert.name}}</td>
            <td>{{alert.origin}}</td>
            <td>{{alert.destiny}}</td>
            <td>{{alert.departure_date}}</td>
            <td>{{alert.travelClass}}</td>
            <td>{{alert.price}}</td>
            
            <td>
              <ul class="actions">
                <li><router-link :to="{ path: '/price-alert/'+ alert.id + '/' + alert.origin_id + '/' + alert.destiny_id + '/' + alert.travelClassId}"><i class="fas fa-eye"></i></router-link></li>
                <li><i :id="alert.id" v-on:click="editPriceAlert" class="fas fa-edit"></i></li>
                <li><i :id="alert.id" v-on:click="deletePriceAlert" class="fas fa-trash"></i></li>
              </ul>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <div>
      <PriceAlertForm :edit="edit" :id="id" :alertForm="alertForm"></PriceAlertForm>
    </div>
    

  </div>
</template>

<script>
import axios from "axios";
import PriceAlertForm from './PriceAlertForm.vue';
import Loader from './Loader.vue';

export default {
  name: 'PriceAlerts',
  data () {
    return {
      loading: false,
      all_alerts: null,
      edit: null,
      id: null,
      alertForm: {},

      origin_id: null,
      destiny_id: null,
    }
  },

  methods: {
    deletePriceAlert(e){ 
        Swal.fire({
        title: '¿Estas seguro de eliminar esta alerta de precio?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: `Cancelar`,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire('alerta de precio eliminada', '', 'success')

            axios.delete(`https://price-alerts-api.herokuapp.com/api/v1/price_alerts/${e.target.id}`)
            .then(response => {
              console.log(response);
              this.showPriceAlert();
            })
          }
        })
    },

    showPriceAlert(){
      axios.get('https://price-alerts-api.herokuapp.com/api/v1/price_alerts')
      .then(response => {
        console.log("RESULTADO");
        console.log(response.data);

        let previw_list = []
        for (let i = 0; i < response.data.length; i++) {

          let origin_name = JSON.parse(response.data[i].origin)
          let destiny_name = JSON.parse(response.data[i].destiny)
          let class_name = JSON.parse(response.data[i].travelClass)

          response.data[i].origin = origin_name['name'];
          response.data[i].destiny = destiny_name['name'];
          response.data[i].travelClass = class_name['name'];

          response.data[i].origin_id = origin_name['id'];
          response.data[i].destiny_id = destiny_name['id'];
          response.data[i].travelClassId = class_name['id'];

          previw_list.push(response.data[i]);
        }
        
        this.all_alerts = previw_list

        console.log("LISTA DE ALERTAS DE PRECIO");
        console.log(this.all_alerts);
      })
      .catch(error => console.log(error))
      .finally(() => this.loading = false)
    },

    editPriceAlert(e){
      this.id = e.target.id

      axios.get(`https://price-alerts-api.herokuapp.com/api/v1/price_alerts/${this.id}`)
      .then(response => {

        let origin_name = JSON.parse(response.data.origin)
        let destiny_name = JSON.parse(response.data.destiny)
        let class_name = JSON.parse(response.data.travelClass)
        response.data.origin = origin_name['name'];
        response.data.destiny = destiny_name['name'];
        response.data.travelClass = class_name['name'];

        this.alertForm['name'] = response.data.name
        this.alertForm['origin'] = response.data.origin
        this.alertForm['destiny'] = response.data.destiny
        this.alertForm['departure_date'] = response.data.departure_date
        this.alertForm['travelClass'] = response.data.travelClass
        this.alertForm['price'] = response.data.price

        this.edit = true

      })
      .catch(error => console.log(error))
    }
  },
    mounted () {
    this.loading = true;
    
    this.showPriceAlert();

    this.$root.$on('my_event', (valid) =>{
      console.log("============= RECIBIDO ==============");
        this.edit = valid;
        this.id = null,
        this.alertForm = {}
        this.showPriceAlert();
    })
  },
  components: {
    PriceAlertForm,
    Loader
  }
}
</script>

<style scoped>
.cont-alerts{
  display: grid;
  grid-template-columns: 69% 29%;
  column-gap: 2%;
}

.cont-table-alerts{
  border-radius: 10px;
  padding: 30px 10px;
  background-color: rgba(255, 255, 255, 0.363);
}

.table-alerts{
  color: rgb(18, 57, 129);
  width: 100%;
  background-color: rgba(255, 255, 255, 0.719);
}

.table-alerts tr td, .table-alerts tr th{
  border: 1px solid rgba(30, 68, 192, 0.356);
  padding: 5px 15px;
}

.table-alerts tr th{
  color: white;
  background-color: rgb(64, 106, 185);
}


.actions li{
  list-style: none;
} 

.actions li i{
  cursor: pointer;
  transition: all .1s ease-in-out;
}
.actions li i:hover{
  color: rgb(0, 141, 235);
  transform: scale(1.05);
}

.actions{
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

h3{
    color: rgb(18, 57, 129);
    margin-bottom: 30px;
}

</style>
