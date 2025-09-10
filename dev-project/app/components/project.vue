
    <!--Galerie de quelques un de mes projets-->
<template>
  <div class="p-container">


<!--C-artes-->
    <ul class="galery">
      <!--carte1-->
      <li>
        <NuxtLink to="#about">
          <img src="/images.jpg" alt="">
        <div class="content">
          <span>
            <h2>E-commerce</h2>
            <p>Projet Concret de l'ecole</p>
          </span>
        </div>
</NuxtLink>

      </li>
      <!--carte2-->
            <li>
        <img src="/images.jpg" alt="">
        <div class="content">
          <span>
            <h2>Application Mobile</h2>
            <p>avec flutter j'ai réalisé une application mobile pour une pharmacie</p>
          </span>
        </div>
      </li>
      <!--carte3-->
            <li>
        <img src="/images.jpg" alt="">
        <div class="content">
          <span>
            <h2>Application web progressive</h2>
            <p>Un projet de reservation de residence</p>
          </span>
        </div>
      </li>

    </ul>
  </div>
</template>
<style lang="scss">
@import '@/assets/scss/project'
</style>