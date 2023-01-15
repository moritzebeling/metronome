<script>

    import { Metronome, BPMCounter } from '$lib/Metronome.js';

    let bpm = 0;
    let beat = 0;

    let counter = new BPMCounter(( last, average ) => {
        bpm = average;
        metronome.start( bpm );
    });

    let metronome = new Metronome( 4, ( b ) => {
        beat = b;
    });

</script>

<svelte:window on:keydown={()=>counter.tap()} on:click={()=>counter.tap()} />

<header>
    <h1>Metronome</h1>
    <p>{bpm} bpm<br />{beat+1}/4</p>
</header>

<main>
    <div class:beat={beat === 0}></div>
    <div class:beat={beat === 1}></div>
    <div class:beat={beat === 2}></div>
    <div class:beat={beat === 3}></div>
</main>

<footer>
    <p>Hit any key to tap beat</p>
</footer>

<style>

    header, footer {
        position: fixed;
        left: 0;
        padding: 1rem;
        -webkit-user-select: none;
        user-select: none;
        width: 100%;
    }

    header {
        top: 0;
        display: flex;
        justify-content: space-between;
    }
    
    footer {
        bottom: 0;
    }

    main {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    main div {
        width: 15vw;
        height: 15vw;
        border-radius: 100%;
        background: #fff;
        margin: 1rem;
    }
    main div.beat {
        /* animation: beat 500ms ease; */
        background-color: blue;
    }
 
    @keyframes beat {
        0%, 100% {
            transform: scale(1);
        }
        10% {
            transform: scale(3);
        }
    }

</style>