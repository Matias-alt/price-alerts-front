<template>
  <div class="container">
    <div class="head-detail">
      <div class="d-flex justify-content-start align-items-center">
          <i class="back fas fa-chevron-left"></i>
          <router-link to="/home"><a class="btn btn-primary ">Volver Atrás</a></router-link>
      </div>
        
        <h1>Detalle alerta de precio</h1>
    </div>
      
    <div class="cont-detail-alert mt-5">
        <div class="cont-detail-attr">
            
            <Loader v-if="loading" ></Loader>
            <ul v-else class="m-0">
                <h2>{{alertData.name}}</h2>
                <hr>
                <li><span>Origen: </span>{{alertData.origin}}</li>
                <hr>
                <li><span>Destino: </span>{{alertData.destiny}}</li>
                <hr>
                <li><span>Fecha: </span>{{alertData.departure_date}}</li>
                <hr>
                <li><span>Clase: </span>{{alertData.travelClass}}</li>
                <hr>
                <li><span>Precio: </span>{{alertData.price}}</li>
                <hr>
            </ul>
        </div>

        <div class="cont-graphic">
          <h2 class="mt-2 mb-4">Grafico de precios minimos historicos</h2>
              <highcharts class="hc" :options="chartOptions" ref="chart"></highcharts>
        </div>
    </div>

    <div  class="cont-table-detail">
        <div v-if="loadingPrices" class="mb-5">
          <p class="mt-5 h2">Aqui encontraras los precios minimos relacionados a tu alerta</p>
          <p class="h2">con una proyeccion de 7 días hace adelante</p>
          <p class="mt-5 mb-5 h4">esto puede tardar unos segundos, espere porfavor</p>
          <Loader></Loader>
        </div>
        
        <table v-else class="table-alerts">
          <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Clase</th>
            <th>Precio Minimo</th>
            <th>Empresa de Bus</th>
          </tr>
          <tr class="hover" v-for="mp in minimumPrices" v-bind:key="mp.id" :value="mp.date" v-on:click="viewRowTable" >
              <td>{{mp.date}}</td>
              <td>{{mp.schedule}}</td>
              <td>{{mp.travelClass}}</td>
              <td>{{mp.price}}</td>
              <td>{{mp.busOperator}}</td>
          </tr>
        </table>

        <div v-if="notFoundData" class="not-found">
            <p class="h3 mt-5 mb-5">No se encontraron resultados para esta alerta de precio</p>
            <i class="fas fa-sad-tear"></i>
          </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import Loader from './Loader.vue';

exportingInit(Highcharts)

export default {
  name: 'PriceAlertDetail',
  
  data() {
    return {
      loading: false,
      loadingPrices: false,
      alertData: {},
      minimumPrices: null,
      notFoundData: false,
      origin_id: null,
      destiny_id: null,

      chartOptions: {
        series: [
          {
            data: []
          }
        ]
      }
      
    };
  },

  methods: {
    getFormattedDate(date) {
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : '0' + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : '0' + day;
      
      return day + '-' + month + '-' + year;
    },

    getMinimumPrices(origin_id, destiny_id, departure_date){
      this.loadingPrices = true;
      axios.get(`https://price-alerts-api.herokuapp.com/api/v1/minimum_prices/get_process?originId=${origin_id}&destinyId=${destiny_id}&travelClass=3&departureDate=${departure_date}`)
      .then(response => {

        if(response.data.success){
          this.minimumPrices = response.data.data;
        }
        else{
          this.notFoundData = true;
        }
      })
      .catch(error => console.log(error))
      .finally(() => {
        this.loadingPrices = false;

        if(!this.notFoundData){
          this.addHistoricalMinimumPrice();
        }
      })
    },

    addHistoricalMinimumPrice(){
      let alertId = this.$route.params.id;
      const data = this.minimumPrices[0]

      axios({
            method: 'post',
            url: 'https://price-alerts-api.herokuapp.com/api/v1/minimum_prices',
            data: {
                date: data.date,
                schedule: data.schedule,
                travel_class: data.travelClass,
                price: data.price,
                bus_operator: data.busOperator,
                id_alert_price: alertId
            }
      })
      .then(response => {
          console.log(response);
      })
      .catch(error => console.log(error))
      .finally(() => {
        axios.get(`https://price-alerts-api.herokuapp.com/api/v1/minimum_prices/get_by_alert_id?alertId=${alertId}`)
        .then(response => {

          for (let i = 0; i < response.data.length; i++) {

              this.chartOptions.series[0].data.push(response.data[i]['price']);
          }
        })
        .catch(error => console.log(error))
      })
    },

    viewRowTable(e){
      const date = e.target.textContent;

      console.log("FECHAAAAA");
      console.log(date);
      axios.get(`https://price-alerts-api.herokuapp.com/api/v1/minimum_prices/get_redirect_url?origin=${this.alertData.origin}&destiny=${this.alertData.destiny}&date=${date}`)
      .then(response => {
        
        let url = response.data.url;
        window.open(url);
      })
      .catch(error => console.log(error))
    }
  },

  mounted (){
    this.loading = true;
    let alertId = this.$route.params.id;
    this.origin_id = this.$route.params.origin_id;
    this.destiny_id = this.$route.params.destiny_id;

    axios.get(`https://price-alerts-api.herokuapp.com/api/v1/price_alerts/${alertId}`)
      .then(response => {

        this.getMinimumPrices(this.origin_id, this.destiny_id, response.data.departure_date)

        let origin_name = JSON.parse(response.data.origin)
        let destiny_name = JSON.parse(response.data.destiny)
        let travelClass = JSON.parse(response.data.travelClass)

        this.alertData['name'] = response.data.name
        this.alertData['origin'] = origin_name['name']
        this.alertData['destiny'] = destiny_name['name']
        this.alertData['departure_date'] = response.data.departure_date
        this.alertData['travelClass'] = travelClass['name']
        this.alertData['price'] = response.data.price
      })
      .catch(error => console.log(error))
      .finally(() => this.loading = false)
  },

  components: {
    Loader
  }
}
</script>

<style scoped>
.head-detail{
  display: grid;
  grid-template-columns: 34% 64%;
  column-gap: 2%;
}
.head-detail h1{
  color: rgb(18, 57, 129);
  text-align: start;
}

.head-detail a{
  text-align: start;
  background-color: rgb(250, 189, 59);
  border: rgb(250, 189, 59);
  border-radius: 5px;
  transition: all .1s ease-in-out;
}
.head-detail a:hover{
  transform: scale(1.02);
}

.back{
  font-size: 35px;
  color: rgb(250, 189, 59);;
  margin-right: 5px;
  
}

.cont-detail-alert{
    display: grid;
    grid-template-columns: 34% 64%;
    column-gap: 2%;
}

.cont-detail-attr, .cont-graphic, .cont-table-detail{
    border-radius: 10px;
    padding: 30px 10px;
    background-color: rgba(255, 255, 255, 0.363);
}
.cont-graphic h2{
  color: rgb(18, 57, 129);
}


.cont-detail-attr h2{
  margin-bottom: 30px;
  background-color: rgb(64, 106, 185);
  border-radius: 50px;
  padding: 10px;
  color: white;
  text-align: center;
}
.cont-detail-attr ul{
    text-align: start;
    padding: 0 20px

}

.cont-detail-attr ul li{
    list-style: none;
    font-size: 25px;
    margin-bottom: 10px;
}
.cont-detail-attr ul li span{
    font-weight: bold;
    color: rgb(18, 57, 129);
}

.cont-table-detail{
    margin-top: 20px;
    padding: 30px;
}
.cont-table-detail p{
   color: rgb(18, 57, 129);
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

.price-valid{
  background-color: rgb(86, 223, 155);
  color: white;
  font-weight: bold;
}

.hover{
  cursor: pointer;
  transition: all .1s ease-in-out;
}
.hover:hover{
  background-color: rgb(245, 231, 151);
}

.not-found{
  color: rgb(18, 57, 129);
}
.not-found i{
  font-size: 100px;

}
</style>
