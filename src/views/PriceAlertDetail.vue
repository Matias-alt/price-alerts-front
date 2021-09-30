<template>
  <div class="about">
    <PriceAlertDetail/>
  </div>
</template>

<script>
import PriceAlertDetail from '../components/PriceAlertDetail.vue'

import swal from 'sweetalert2';
window.Swal = swal;

export default {
  name: 'Home',
  components: {
    PriceAlertDetail
  }
}
</script>