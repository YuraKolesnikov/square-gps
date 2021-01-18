<template>
  <div class="home">
    <button @click="addLandmark" v-if="canAddLandmark">{{ isLoading ? 'Creating...' : 'Add new landmark' }}</button>
    <ul>
      <template v-for="(landmark, i) in landmarks">
        <li v-if="landmark && landmark.title" @click="moveToLandmark(i)">
          {{ landmark.title }}
        </li>
      </template>
    </ul>
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      map: null,
      landmarkData: {
        longitude: null,
        latitude: null
      }
    }
  },
  mounted() {
    ymaps.ready(this.init)
  },
  computed: {
    ...mapState(['landmarks', 'isLoading']),

    canAddLandmark() {
      return this.landmarkData.longitude && this.landmarkData.latitude
    }
  },
  methods: {
    ...mapActions(['ADD_LANDMARK']),

    init() {
      this.map = new ymaps.Map('map', {
        center: [55.75, 37.61],
        zoom: 12,
        controls: ['zoomControl']
      })

      this.landmarks.forEach(lm => {
        const placemark = this.createPlacemark(lm)

        this.map.geoObjects.add(placemark)
      })

      this.map.events.add('click', e => {
        const coords = e.get('coords')
        this.landmarkData.latitude = +coords[0].toFixed(2)
        this.landmarkData.longitude = +coords[1].toFixed(2)
      })
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
  height: 100vh;
  width: 100vw;
  padding: 20px;
}

.map {
  height: 80%;
  width: 60%;
  margin: auto;
}
</style>
