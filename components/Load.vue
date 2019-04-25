<template>
  <div class="load-wapper">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Components  } from 'vue-property-decorator';
import { mapMutations } from 'vuex'
import { State, Mutation } from "vuex-class";


@Component
export default class Load extends Vue {


}
</script>
<style lang="scss">
.load-wapper{
	@include fixed((t:0,l:0,w:100%,h:100%,z:100));
	@include bgc(rgba(55,55,55,.6));
}
</style>
