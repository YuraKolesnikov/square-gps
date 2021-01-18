<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <button @click="addLandmark" v-if="canAddLandmark">Add new landmark</button>
      <ul>
        <li v-for="(landmark, i) in landmarks" @click="moveToLandmark(i)">
          {{ landmark.title }}
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      map: null,
      landmarkData: {
        longitude: null,
        latitude: null
      },
      landmarks: [
        {
          title: 'Landmark #1',
          latitude: 55.75,
          longitude: 37.61
        }
      ]
    }
  },
  mounted() {
    ymaps.ready(this.init)
  },
  computed: {
    canAddLandmark() {
      return this.landmarkData.longitude && this.landmarkData.latitude
    }
  },
  methods: {
    init() {
      this.map = new ymaps.Map('map', {
        center: [55.75, 37.61],
        zoom: 12,
        controls: ['zoomControl']
      })

      console.log(ymaps.GeoPoint)

      const firstPlacemark = new ymaps.Placemark([55.75, 37.61], {
        draggable: true,
        balloonContent: 'ID: 1<br>Latitude: 55.75<br>Longitude: 37.61'
      }, {
        hideIconOnBalloonOpen: false
      })

      this.map.geoObjects.add(firstPlacemark)

      this.map.events.add('click', e => {
        const coords = e.get('coords')
        console.log(coords)
        this.landmarkData.latitude = +coords[0].toFixed(2)
        this.landmarkData.longitude = +coords[1].toFixed(2)
      })
    },
    addLandmark() {
      const payload = {
        center: [this.landmarkData.latitude, this.landmarkData.longitude],
        balloonContent: `ID: 2<br>Latitude: ${this.landmarkData.latitude}<br>Longitude: ${this.landmarkData.longitude}`
      }
      const newPlacemark = new ymaps.Placemark(
        payload.center,
        {
          balloonContent: payload.balloonContent
        }, {
          hideIconOnBalloonOpen: false
        }
      )
      this.map.geoObjects.add(newPlacemark)
      this.landmarks.push({
        title: 'Landmark #2',
        latitude: this.landmarkData.latitude,
        longitude: this.landmarkData.longitude
      })
    },
    moveToLandmark(i) {
      const landmark = this.map.geoObjects.get(i)
      if (!landmark.balloon.isOpen()) {
        console.log(this.landmarks[i])
        this.map.setCenter([this.landmarks[i].latitude, this.landmarks[i].longitude], this.map.getZoom(), { duration: 300 })
        .then(() => landmark.balloon.open())

      } else {
        landmark.balloon.close();
      }
      return false
    },
  }
}
</script>

<style>
.ymaps-2-1-78-balloon {
  transform: translateY(-30px);
}
</style>
