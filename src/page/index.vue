<template>
    <div>  
        <leftNav></leftNav>
        <aHeader></aHeader>
        <div class="amain">
             <router-view></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import leftNav from "@/components/common/leftnav.vue"
import aHeader from "@/components/common/aheader.vue"
@Component({
    components: {
        leftNav,
        aHeader
    }
})
export default class Index extends Vue {

}
</script>

<style lang="scss">
#app{
    background:#eeeff2;
}
</style>

