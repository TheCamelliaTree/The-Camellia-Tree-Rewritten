<div v-if="tmp.world.effect.timeLimit" id="timer" class="fullWidth">
<h1><span>{{
    Math.floor(tmp.world.effect.timeLeft / 60).toLocaleString("en-US")
}}</span>:<span>{{
    Math.floor((tmp.world.effect.timeLeft / 10) % 6).toLocaleString("en-US")
}}</span><span>{{
    Math.floor(tmp.world.effect.timeLeft % 10).toLocaleString("en-US")
}}</span>.<span style="font-size:.5em">{{
    Math.floor((tmp.world.effect.timeLeft * 10) % 10).toLocaleString("en-US")
}}</span></h1>
</div>