<template>
  <div class="home">
    <h1>PRUEBA RECORRIDO.CL</h1>
    <div class="container">
      <div class="mt-5">
        <PriceAlert/>
      </div>
    </div>
  </div>
</template>

<script>
import PriceAlert from '../components/PriceAlert.vue'

import swal from 'sweetalert2';
window.Swal = swal;

export default {
  name: 'Home',
  components: {
    PriceAlert
  }
}
</script>

