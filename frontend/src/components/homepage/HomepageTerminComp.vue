<template>
    <div>
        <v-list-item @click="openTermin">
            <v-list-item-content>
                <v-list-item-title v-html="headline"></v-list-item-title>
                <v-list-item-subtitle v-html="subline"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-btn icon>
                    <v-icon>{{icon}}</v-icon>
                </v-btn>
            </v-list-item-action>
        </v-list-item>
    </div>
</template>

<script lang="ts">
	import { MyActions } from '@/models/Store/State';
	import Vue from 'vue';

    export default Vue.extend({
        name: "HomepageTerminComp",
        props: ['termin'],
        computed: {
            headline: function(): string {
                return `${this.termin.date} (${this.termin.name})`;
            },
            subline: function(): any {
                if (this.termin.endtime) {
                    return `${this.termin.time} - ${this.termin.endtime}`;
                } else {
                    return this.termin.time;
                }
            },
            icon: function(): string {
                if (this.termin) {
                    if (this.termin.type === null) return 'warning';
                    const icons = ['check_circle', 'check_circle_outline', 'cancel'];
                    return icons[this.termin.type];
                } else {
                    return '';
                }
            }
        },
        methods: {
            openTermin: function(): void {
                const raid = { id: this.termin.raidID, name: this.termin.name, icon: this.termin.icon, role: this.termin.role };
                this.$vStore.dispatch(MyActions.OpenTerminFromHome, {termin: this.termin, raid: raid});
            }
        }
    })
</script>

<style scoped>

</style>