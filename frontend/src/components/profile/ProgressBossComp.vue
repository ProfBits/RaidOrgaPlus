<template>
    <v-btn fab
           :color="progressColor">
        <v-avatar>
            <v-img :src="icon(boss.abbr)">
            </v-img>
        </v-avatar>
    </v-btn>
</template>

<script lang="ts">
	import Vue from 'vue';
    import _icons from '../../services/icons';

    export default Vue.extend({
        name: "ProgressBossComp",
        props: ['boss', 'progress'],
        computed: {
            progressColor: function(): string {
                if (this.progress && this.progress.indexOf(this.boss.apiname) !== -1) return 'success';
                else return 'error';
            }
        },
        methods: {
            icon: function(enc: any): string | undefined {
                if (enc) return _icons.encIcon(enc);
            }
        }
    })
</script>

<style scoped>

</style>