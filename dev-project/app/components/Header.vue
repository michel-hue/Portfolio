<!--Header-->
<template>
<div class="h-container">
  <header>

      <!--Titre-->
   <div class="text">
    <h1>Archange Yebouet</h1>
   </div>

     <!--Navigations-->

         <!--Navigation1-->
   <nav>
   <ul>
    <li>  <NuxtLink to="/">A Propos de moi</NuxtLink></li>
    <li>  <NuxtLink to="/">Projets</NuxtLink></li>
    <li>  <NuxtLink to="/">Experience</NuxtLink></li>
    <li>   <NuxtLink to="/about">FAQ</NuxtLink></li>
   </ul>
   </nav>
            <!--Navigation2-->
   <nav>
   <ul class="lien">
    <li><NuxtLink to="/about">Entrez en contact</NuxtLink></li>
   </ul>  
   </nav>
</header>
</div>
</template>
<style lang="scss">
@import '@/assets/scss/header';

</style>
