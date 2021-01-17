<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <button @click="addLandmark">Add new landmark</button>
      {{ landmarkData }}
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
          title: 'Моховая ул. 8c2',
          latitude: 55.75,
          longitude: 37.61
        }
      ]
    }
  },
  mounted() {
    ymaps.ready(this.init)
  },
  methods: {
    init() {
      this.map = new ymaps.Map('map', {
        center: [55.75, 37.61],
        zoom: 12,
        controls: ['zoomControl'],
        behaviors: ['drag']
      })

      const firstPlacemark = new ymaps.Placemark([55.75, 37.61], {
        hintContent: 'Моховая ул. 8c2',
        balloonContent: 'Моховая ул. 8c2'
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
        balloonContent: 'Landmark Nr. 2'
      }
      const newPlacemark = new ymaps.Placemark(payload.center, {
        balloonContent: payload.balloonContent
      })
      this.map.geoObjects.add(newPlacemark)
      this.landmarks.push({
        title: payload.balloonContent,
        latitude: this.landmarkData.latitude,
        longitude: this.landmarkData.longitude
      })
    },
    moveToLandmark(i) {
      const landmark = this.map.geoObjects.get(i)
      if (!landmark.balloon.isOpen()) {
        console.log(this.landmarks[i])
        this.map.setCenter([this.landmarks[i].latitude, this.landmarks[i].longitude])
        landmark.balloon.open();
      } else {
        landmark.balloon.close();
      }
      return false
    }
  }
}
</script>
