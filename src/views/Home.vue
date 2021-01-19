<template>
  <div class="home">
      <v-row no-gutters>
        <v-col cols="3" class="landmark-list">
          <h2 class="landmark-header">Landmarks</h2>
          <v-list-item-group>
            <template v-for="(landmark, i) in landmarks">
              <v-list-item :key="`landmark_${i}`" v-if="landmark && landmark.title" @click="moveToLandmark(i)">
                <v-list-item-content>
                  <h4 class="body-1" v-if="landmark && landmark.title">{{ landmark.title }}</h4>
                  <p class="text--secondary" v-if="landmark && landmark.latitude && landmark.longitude">{{ landmark.latitude }}, {{ landmark.longitude }}</p>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-col>
        <v-col cols="9">
          <div id="map" class="map"></div>
        </v-col>
      </v-row>
    <v-btn small fab absolute @click="addLandmark" class="add-button" :loading="isLoading" v-if="canAddLandmark">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      currentLandmark: null,
      landmarkData: {
        longitude: null,
        latitude: null
      }
    }
  },

  created() {
    navigator.geolocation.getCurrentPosition(position => {
      this.landmarkData.latitude = position.coords.latitude.toFixed(6)
      this.landmarkData.longitude = position.coords.longitude.toFixed(6)
      ymaps.ready(this.init)

      if (this.map === null) {

        this.addLandmark()
      }
    })
  },

  computed: {
    ...mapState(['landmarks', 'isLoading', 'map']),

    canAddLandmark() {
      return this.landmarkData.longitude && this.landmarkData.latitude
    }
  },
  methods: {
    ...mapActions(['ADD_LANDMARK']),
    ...mapMutations(['SET_MAP']),
    init() {
      this.SET_MAP(new ymaps.Map('map', {
        center: [this.landmarkData.latitude, this.landmarkData.longitude],
        zoom: 12,
        controls: ['zoomControl']
      }))

      this.landmarks.forEach(lm => {
        const placemark = this.createPlacemark(lm)
        this.map.geoObjects.add(placemark)
      })

      this.map.events.add('click', e => {
        const coords = e.get('coords')
        this.landmarkData.latitude = +coords[0].toFixed(6)
        this.landmarkData.longitude = +coords[1].toFixed(6)
      })

      this.clearLandmarkData()
    },

    addLandmark() {
      const nextId = ++this.landmarks.length
      /* Add landmark to state */
      const payload = {
        id: nextId,
        title: `Landmark #${nextId}`,
        latitude: this.landmarkData.latitude,
        longitude: this.landmarkData.longitude
      }

      this.ADD_LANDMARK(payload)
      .then(() => {
        const newLandmark = this.createPlacemark(payload)
        this.map.geoObjects.add(newLandmark)

        this.clearLandmarkData()
      })
    },

    moveToLandmark(i) {
      const landmark = this.map.geoObjects.get(i)
      if (!landmark.balloon.isOpen()) {
        const urlId = i + 1
        this.$router.replace({ name: 'Home', query: { id: urlId } })

        this.map.setCenter(
          [this.landmarks[i].latitude, this.landmarks[i].longitude],
          this.map.getZoom(),
          { duration: 300 }
        ).then(() => landmark.balloon.open())

      } else {
        landmark.balloon.close()
      }

      return false
    },

    createPlacemark(payload) {
      return new ymaps.Placemark(
        [ payload.latitude, payload.longitude ],
        { balloonContent: `ID: ${payload.id}<br>Latitude: ${this.landmarkData.latitude}<br>Longitude: ${this.landmarkData.longitude}` },
        { hideIconOnBalloonOpen: false }
      )
    },

    clearLandmarkData() {
      this.landmarkData = {
        latitude: null,
        longitude: null
      }
    }
  }
}
</script>

<style>
.ymaps-2-1-78-balloon {
  transform: translateY(-30px);
}
</style>


<style lang="scss">
.home {
  height: calc(100vh - 90px);
  width: 100vw;
  position: relative;

  .container, .row {
    height: 100%;
  }
}

.add-button {
  bottom: 10px !important;
  right: 15px !important;
}

.map {
  height: 100%;
  width: 100%;
  margin: auto;
}

.landmark-list {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
}

.landmark-header {
  padding: 16px;
}

.text--secondary {
  opacity: .5 !important;
}
</style>
