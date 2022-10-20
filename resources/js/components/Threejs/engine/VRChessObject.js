import {
    Mesh,
    DoubleSide,
    MeshBasicMaterial,
  } from 'three';

import * as Chess from '../../libs/chess.js';
import '@chrisoakman/chessboardjs/dist/chessboard-1.0.0.css'; 
import '@chrisoakman/chessboardjs/dist/chessboard-1.0.0.js'; 
import $ from 'jquery';

import VRGameObject from './VRGameObject.js';
import { textureLoader, chessTexture, chessGeometry, btnGeometry, emptySeatTexture, ai_avatar, squareGeometry } from './helpers/texturesAndGeometries';
import { GAME_EVENTS } from '../../constants/game.js';
import { v4 as uuidv4 } from 'uuid';

import { chess_game } from '../components.js';

const aiProfile = {
    userId: 'na',
    userName: 'AI',
    userAvatarUrl: './textures/AI_avatar.png'
}

export default class VRChessObject extends VRGameObject {
  
    constructor(containerName, camera, texture, x, y, z, model) {
  
        super(containerName, model);

        const id = uuidv4();
        this.gameUniqueId = `chess-game-container_${id}`;

        const gameTemplate = $(chess_game(id, model.languageObject));
        $("#chess-game-modals").append(gameTemplate);

        this.gameInstance = $(`#chess-game-container_${id}`);
        this.gameModal = $(`#chess-game_${id}`);
        this.chessVisitorsStats = $(`#chess-visitors-stats_${id}`);
        this.chessRestartBtn = $(`.chess-restart_${id}`);
        this.winnerModal = $(`#modal-winner_${id}`);
        this.winnerMsg = $(`#winner-msg_${id}`);
        this.chessVisitorsAvatars = $(`#chess-visitors-avatars_${id}`);
        this.chessVisitorsNumber = $(`#chess-visitors-number_${id}`);
        this.chessButtonsToggle = $(`#toggleChessButtons_${id}`);
        this.toggleVisitorsVisibility = $(`#chess-toggle-visitors-visibility_${id}`);
        this.visitorsContainer = $(`#chess-visitors-container_${id}`);
        this.playerOneContainer = $(`#chess-player-one_${id}`);
        this.playerTwoContainer = $(`#chess-player-two_${id}`);
        this.playerOneImg = this.playerOneContainer.find(`.chess-avatar-wrapper > img`);
        this.playerTwoImg = this.playerTwoContainer.find(`.chess-avatar-wrapper > img`);
        
        this.board = window.Chessboard(this.gameUniqueId);
        this.board.resize();
        $(window).on('resize', ()=>{ this.board.resize(); });

        this.game = null;
        // this.gameType = null;
        this.waitingForOpponent = false;
        this.checkTimer = null;
        this.whiteSquareGrey = '#96cc31'; //'#757575';
        this.blackSquareGrey = '#80ae2a'; //'#696969';
        this.squareClass = 'square-55d63';
        this.squareToHighlight = null;

        this.player1 = {color: 'w', profile: null}
        this.player2 = {color: 'b', profile: null}

        this.camera = camera;
        this.material = new MeshBasicMaterial({ map: texture, side: DoubleSide, transparent: true });

        this.mesh = new Mesh(this.model.editMode ? squareGeometry : chessGeometry, this.material);
        this.mesh.type = 'chessGame';
        this.mesh.name = 'chessGame';
        this.name = 'chessGame';

        this.boardConfig = {
            orientation: 'white',
            position: 'start',
            draggable: true,
            moveSpeed: 'slow',
            snapbackSpeed: 500,
            // dropOffBoard: 'trash',
            snapSpeed: 100,
            onDragStart: this.onDragStart,
            onDrop: this.onDrop,
            onMoveEnd: this.onMoveEnd,
            onSnapEnd: this.onSnapEnd,
            onMouseoutSquare: this.onMouseoutSquare,
            onMouseoverSquare: this.onMouseoverSquare
        }

        this.gameData = { activeGame: false, from: '', to: '', fen: '', turn: 'w', player1: this.player1, player2: this.player2 };

        // INIT
        this.camera !==null ? this._setInitialPosRot() : this.setPosition(x, y, z);

        this.add(this.mesh);

        this.mesh.groupDetails = {title: this.model.languageObject['chess-game'].text, icon: 'sports_esports', editTitle: this.model.languageObject['edit-chess-game'].text, dataLang: 'edit-chess-game'}

        if(!this.model.editMode){
            this.addElement('chessPlayer1', btnGeometry, emptySeatTexture, 'chessAvatar', -15, 27, 0);
            this.addElement('chessPlayer2', btnGeometry, emptySeatTexture, 'chessAvatar', 15, 27, 0);
        }

        this.limits.min = 290;
        this.limits.max = 310;
        
        this.model.editMode && this.editControls();
        
        return this; 
    }
    
    updateGameDataHandler = (payload) =>{
        // this will handle movements actions
        switch(payload.action){
            case 'turn' : this.turnHandler(payload); break;
            case 'end game' : this.gameData === payload.gameData; this.activeGame = false; break;
            default: console.error(payload);
        }
    }

    turnHandler = (payload) =>{
        if(this.game === null) return;
        // this will handle movements actions
        if(payload.userId !== this.userProperties.userId){
            this.gameData = payload.gameData;
            
            // console.log('condition passed', this.gameData)
            this.game.move({
                from: payload.gameData.from,
                to: payload.gameData.to,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            
            this.board.position(payload.gameData.fen);
            this.game.setTurn(payload.gameData.turn);

            const clr = this.game.turn() === 'b' ? 'black' : 'white';
            this.removeHighlights(clr);
            this.gameInstance.find('.square-' + payload.gameData.from).addClass(`highlight-${clr}`);
            this.gameInstance.find('.square-' + payload.gameData.to).addClass(`highlight-${clr}`);

            this.updateStatus();
        }else{
            // console.log("I'm the sender", payload);
        }
    }

    visitorsNumberBlink = () =>{
        if(this.visitorsBlinkTimer){
            clearTimeout(this.visitorsBlinkTimer);
            this.visitorsBlinkTimer = null;
        }

        this.chessVisitorsStats.addClass('blink');

        this.visitorsBlinkTimer = setTimeout(()=>{
            this.chessVisitorsStats.removeClass('blink');
        }, 2000);
    }

    handleChessGame = () =>{
        // todo: assign player1 and player2 data, check if empty 'seats' otherwise just watch the game
        this.activeGame ? $("#continue-play-holder").show() : $("#continue-play-holder").hide();
        // $(".chess-game-landing").addClass('is-active');
    }

    minimizeGame = () =>{
        $(".chess-game").removeClass('is-active');
        this.minimized = true;
    }
    
    startVsComputer = () =>{
        // this.gameType = 'vsComputer';
        this.initGame();
        this.chessPlayer1.material.map = this.model.userAvatarTexture;
        this.chessPlayer2.material.map = ai_avatar;
        this.player1.profile = this.model.getUserData();
        this.player2.profile = aiProfile;
        this.chessPlayer1.visible = true;
        this.chessPlayer2.visible = true;
        this.playerOneImg.attr('src', this.player1.profile.userAvatarUrl);
        this.playerTwoImg.attr('src', aiProfile.userAvatarUrl);
    }

    joinMultiplayerLobby = () =>{
        if(this.minimized){
            this.continuePlaying();
            return;
        }

        this.chessRestartBtn.hide();

        this.playerOrientationCorrection();

        this.send({
          eventName: GAME_EVENTS.NEW_VISITOR,
          userId: this.userProperties.userId,
          gameId: this.dbConfig.id,
          gameData: this.gameData,
          data: {
            userId: this.userProperties.userId,
            userName: this.userProperties.userName,
            userAvatarUrl: this.userProperties.userAvatarUrl,
            wpId: this.userProperties.wpId || false
          }
        });

        $(".loading-spinner").addClass('visible');
    }

    playerOrientationCorrection = () =>{
        if(this.board.orientation() === 'white'){
            this.playerOneContainer.removeClass('top');
            this.playerOneContainer.addClass('bottom');
    
            this.playerTwoContainer.removeClass('bottom');
            this.playerTwoContainer.addClass('top');
        }else{
            this.playerTwoContainer.removeClass('top');
            this.playerTwoContainer.addClass('bottom');
    
            this.playerOneContainer.removeClass('bottom');
            this.playerOneContainer.addClass('top');
        }
    }

    gameStart = ()=>{
        this.activeGame = true;
        this.game = this.gameData.fen ? new Chess(this.gameData.fen) : new Chess();
        this.board = window.Chessboard(this.gameUniqueId, {...this.boardConfig, position: this.gameData.fen || 'start'});
        this.game.setTurn(this.gameData.turn);
        this.playerOrientationCorrection();
        this.updateStatus();
        this.players[this.userProperties.userId] ? this.chessRestartBtn.show() :  this.chessRestartBtn.hide();
    }

    startVsRealPlayer = () =>{
        $(".loading-spinner").removeClass('visible');
        // if(this.activeGame){
            if(this.game === null){
                this.game = this.gameData.fen ? new Chess(this.gameData.fen) : new Chess();
            }
            
            this.board = window.Chessboard(this.gameUniqueId, {...this.boardConfig, position: this.gameData.fen});
            this.game.setTurn(this.gameData.turn);
            this.setPlayerAvatar('player1');
            this.setPlayerAvatar('player2');
            // console.log('startvsrealplayer, fen used:', this.gameData)
        // }else{
        //     this.board.clear();
        //     if(!this.minimized){
        //         // console.log(this.player1, this.player2)
        //         this.playerOneContainer.toggleClass("chess-player-select", this.player1.profile === null);
        //         this.playerOneContainer.toggleClass("chess-player-info", this.player1.profile !== null);
        //         this.playerTwoContainer.toggleClass("chess-player-select", this.player2.profile === null);
        //         this.playerTwoContainer.toggleClass("chess-player-info", this.player2.profile !== null);
        //     }else{
                this.minimized = false;
        //     }
            
        //     this.playerOneImg.attr('src', this.player1.profile === null ? './textures/empty.png' : this.player1.profile.userAvatarUrl);
        //     this.playerTwoImg.attr('src', this.player2.profile === null ? './textures/empty.png' : this.player2.profile.userAvatarUrl);
        // }

        this.playerOrientationCorrection();

        this.chessVisitorsStats.addClass('visible');
        // $(".chess-game-landing").removeClass('is-active');
        this.gameModal.addClass('is-active');

        this.visitorsNumberBlink();
    }

    setPlayer = (player, clicked=false) =>{
        clicked && ( this.iAmPlayer = true );
        this.gameModal.find(".chess-player-select").removeClass('chess-player-select');
        
        this[player].color = player === 'player1' ? 'w' : 'b';
        this[player].profile = {userId: this.userProperties.userId, userName: this.userProperties.userName, userAvatarUrl: this.userProperties.userAvatarUrl, wpId: this.userProperties.wpId || false }

        !clicked && this.setPlayerAvatar(player);

        clicked && this.send({
            eventName: GAME_EVENTS.NEW_PLAYER,
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            status: player,
            playerData: this[player]
        });
    }

    continuePlaying = () =>{
        this.minimized = false;
        // $(".chess-game-landing").removeClass('is-active');
        this.gameModal.addClass('is-active');
    }

    initGame = () =>{
        const playerColor = $("#chess-player-color").val();
        
        if(this.activeGame){
            this.board.destroy();
            this.newGame(playerColor);

        }else{
            this.newGame(playerColor);
        }

        // $(".chess-game-landing").removeClass('is-active');
        this.gameModal.addClass('is-active');
    }
    
    newGame = (playerColor) =>{
        this.reset();
        this.boardConfig.position = 'start';
        this.game = new Chess();
        this.board = window.Chessboard(this.gameUniqueId, {...this.boardConfig, orientation: playerColor});
        this.activeGame = true;
        // (this.player2.color === 'w' && this.gameType === 'vsComputer') && setTimeout(this.makeRandomMove, 1250);
        this.playerOneContainer.toggleClass('active', this.player1.color === 'w');
        this.playerTwoContainer.toggleClass('active', this.player2.color === 'w');
    }

    end = () =>{
        this.material.map = chessTexture;
    }
  
    onDragStart = (source, piece, position, orientation) =>{
        if (this.game === null) return false;
        // do not pick up pieces if the game is over
        if (this.game.game_over()) return false;

        if(!this.activeGame) return false;
        if(this.player1.profile === null || this.player2.profile === null) return false;

        if(this.player1.profile.userId === this.userProperties.userId || this.player2.profile.userId === this.userProperties.userId){
            if( this.player1.profile.userId === this.player2.profile.userId ){
                if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
                    (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
                    return false
                }
            }else{
                if(this.player1.profile.userId === this.userProperties.userId){
                    if (piece.search(/^b/) !== -1) return false;
                }
                if(this.player2.profile.userId === this.userProperties.userId){
                    if (piece.search(/^w/) !== -1) return false;
                }
            }
            
        }else{
            return false;
        }
    }
    
    onDrop = (source, target) =>{
        if (this.game === null) return false;
        this.removeGreySquares();
        // see if the move is legal
        const move = this.game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        
        // illegal move
        if (move === null) return 'snapback';

        const clr = this.game.turn() === 'b' ? 'black' : 'white';
        this.removeHighlights(clr);
        this.gameInstance.find('.square-' + source).addClass(`highlight-${clr}`);
        this.gameInstance.find('.square-' + target).addClass(`highlight-${clr}`);

        // this.gameType === 'vsComputer' && setTimeout(this.makeRandomMove, 250);

        this.send({
            eventName: GAME_EVENTS.UPDATE_GAME_DATA,
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            data: { fen: this.game.fen(), from: source, to: target, turn: this.game.turn() },
            action: 'turn'
        });
        
        this.updateStatus();
    }
    
    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    onSnapEnd = () =>{
        this.board.position(this.game.fen());
    }
    
    updateStatus = () =>{
        if (this.game === null) return false;
        let status = '';

        const lng = this.model.languageObject;
        
        let moveColor = lng['chess-white'].text;
        const turn = this.game.turn();

        if ( turn === 'b') {
            moveColor = lng['chess-black'].text;
        }

        this.playerOneContainer.toggleClass('active', this.player1.color === turn);
        this.playerTwoContainer.toggleClass('active', this.player2.color === turn);

        const moves = this.game.history({verbose: true})
        
        if(moves.length){
            const lastMove = moves[moves.length - 1];
            let validPlayerNotification = false;
            let msg = '';

            if(this.player1.profile.userId === this.userProperties.userId && this.player1.color === turn && this.minimized){
                msg = `${this.player2.profile.userName} ${lng['chess-made-a-move'].text} ( ${lastMove.from} ${lng['chess-to'].text} ${lastMove.to} ) ${lng['chess-in-your-chessgame'].text}`;
                validPlayerNotification = true;
            }

            if(this.player2.profile.userId === this.userProperties.userId && this.player2.color === turn && this.minimized){
                msg = `${this.player1.profile.userName} ${lng['chess-made-a-move'].text} ( ${lastMove.from} ${lng['chess-to'].text} ${lastMove.to} ) ${lng['chess-in-your-chessgame'].text}`;
                validPlayerNotification = true;
            }

            validPlayerNotification && this.model.confirm(msg, ()=>{ this.continuePlaying()}, {withSound: true, confirmBtnTxt: lng['open-game-text'].text, cancelBtnTxt: 'OK'});
        }

        const area = this.player1.color === turn ? 'bottom right' : 'top right';
        
        // checkmate?
        if (this.game.in_checkmate()) {
            const playerName = turn === this.player1.color ? this.player2.profile.userName : this.player1.profile.userName;
            
            status = `${lng['game-over-text'].text}, ${playerName} ${lng['win-game-text'].text}! ${moveColor} ${lng['chess-in-checkmate'].text}.`;
            this.playerOneContainer.toggleClass('checkmate', this.player1.color === turn);
            this.playerTwoContainer.toggleClass('checkmate', this.player2.color === turn);
            this.playerOneContainer.toggleClass('victory', this.player1.color !== turn);
            this.playerTwoContainer.toggleClass('victory', this.player2.color !== turn);
            this.showWinner(status);
        }
        
        // draw?
        else if (this.game.in_draw()) {
            status = `${lng['game-over-text'].text}, ${lng['drawn-position-text'].text}!`;
            this.playerOneContainer.addClass('draw');
            this.playerTwoContainer.addClass('draw');
            this.showWinner(status);
        }
        
        // game still on
        else {
            // check?
            if (this.game.in_check()) {
                status = `${moveColor} ${lng['chess-in-check'].text}`;
                this.playerOneContainer.toggleClass('check', this.player1.color === turn);
                this.playerTwoContainer.toggleClass('check', this.player2.color === turn);
                this.model.alert('error', status, {area});
            }
        }


        if(this.checkTimer){
            clearTimeout(this.checkTimer);
            this.checkTimer = null;
        }

        this.checkTimer = setTimeout(()=>{
            $(".chess-player").removeClass('check');
        }, 5000);
    }

    makeRandomMove = () =>{
        if (this.game.turn() === this.player2.color) {
            const possibleMoves = this.game.moves({verbose: true});
       
            // game over
            if (possibleMoves.length === 0){
                this.model.alert('neutral',this.model.languageObject['no-more-moves'].text, {area: 'middle right'});
                // setTimeout(this.updateStatus, 1000);
                return;
            }
            
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            this.game.move(move.san);

            // console.log(move)

            const clr = this.player2.color === 'b' ? 'black' : 'white';

            this.removeHighlights(clr);
            this.gameInstance.find('.square-' + move.from).addClass(`highlight-${clr}`);
            this.squareToHighlight = move.to;

            this.board.position(this.game.fen());
            
            setTimeout(this.updateStatus, 1000);
        }
    }

    removeHighlights = (color) => {
        this.gameInstance.find('.' + this.squareClass).removeClass('highlight-' + color);
    }

    onMoveEnd = () => {
        const clr = this.player2.color === 'b' ? 'black' : 'white';
        this.gameInstance.find('.square-' + this.squareToHighlight).addClass(`highlight-${clr}`);
    }

    greySquare = (square) => {
        const $square = this.gameInstance.find('.square-' + square);
      
        let background = $square.hasClass('black-3c85d') ? this.blackSquareGrey : this.whiteSquareGrey;
      
        $square.css('background', background);
    }

    removeGreySquares = () =>{
        this.gameInstance.find('.square-55d63').css('background', '');
    } 

    onMouseoverSquare = (square, piece) =>{
        // get list of possible moves for this square

        if(this.game === null) return;

        const moves = this.game.moves({
          square: square,
          verbose: true
        });
      
        // exit if there are no moves available for this square
        if (moves.length === 0) return
      
        // highlight the square they moused over
        this.greySquare(square);
      
        // highlight the possible squares for this piece
        for (let i = 0; i < moves.length; i++) {
          this.greySquare(moves[i].to);
        }
    }
      
    onMouseoutSquare = (square, piece) =>{
        this.removeGreySquares();
    }

    reset = () =>{
        $(".chess-player").removeClass('check checkmate victory draw active');
        this.winnerModal.removeClass('is-active');
        this.removeHighlights('white');
        this.removeHighlights('black');
    }

    showWinner = (msg) =>{
        this.activeGame = false;
        this.winnerMsg.html(msg);
        this.winnerModal.addClass('is-active');

        this.send({
            eventName: GAME_EVENTS.UPDATE_GAME_DATA,
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            data: { activeGame: false, fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', from: '', to: '', turn: 'w' },
            action: 'end game'
        });
    }
    
    quitGame = () =>{
        $(".chess-game").removeClass('is-active');
        this.minimized = false;
        let userStatus = 'visitor';

        if(this.player1.profile !== null){
            if(this.player1.profile.userId === this.userProperties.userId){
                userStatus = 'player';
                this.playerOneContainer.removeClass("active");
            }
        }

        if(this.player2.profile !== null){
            if(this.player2.profile.userId === this.userProperties.userId){
                userStatus = 'player';
                this.playerTwoContainer.removeClass("active");
            }
        }
        
        this.send({
            eventName: GAME_EVENTS.VISITOR_OR_PLAYER_LEFT,
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            userStatus,
        });
    }

    restartGame = () =>{
        if( this.player1.profile === null || this.player2.profile === null ){
            this.model.alert('neutral', this.model.languageObject['error-waiting-second-player'].text);
            return;
        }

        this.send({
            eventName: GAME_EVENTS.RESTART_GAME,
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            gameData: {from: '', to: '', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', lastActivePlayer: 0, turn: 'w'}
        });
    }

    restartGameHandler = (payload) =>{
        this.game = new Chess();
        this.board.start();
        this.reset();
        this.activeGame = true;
        this.updateStatus();
    }

    setPlayerAvatar = (player) =>{
        switch(player){
            case 'player1':
                this.playerOneImg.attr('src', `${this.player1.profile !== null ? this.player1.profile.userAvatarUrl : './textures/empty.png'}`);
                this.chessPlayer1.material.map = this.player1.profile !== null ? textureLoader.load(this.player1.profile.userAvatarUrl) : emptySeatTexture;
                this.chessPlayer1.visible = this.player1.profile !== null ? true : false;
                this.playerOneContainer.toggleClass("chess-player-select", this.player1.profile === null);
                this.playerOneContainer.toggleClass("chess-player-info", this.player1.profile !== null);
                break;
            case 'player2':
                this.playerTwoImg.attr('src', `${this.player2.profile !== null ? this.player2.profile.userAvatarUrl : './textures/empty.png'}`);
                this.chessPlayer2.material.map = this.player2.profile !== null ? textureLoader.load(this.player2.profile.userAvatarUrl) : emptySeatTexture;
                this.chessPlayer2.visible = this.player2.profile !== null ? true : false;
                this.playerTwoContainer.toggleClass("chess-player-select", this.player2.profile === null);
                this.playerTwoContainer.toggleClass("chess-player-info", this.player2.profile !== null);
                break;
            default: return false;
        }
    }

    getInitialGameDataHandler = (payload) =>{
        // console.log(payload);
        if(payload.gameData){
            payload.gameData.hasOwnProperty('activeGame') && ( this.activeGame = payload.gameData.activeGame );
            payload.gameData.hasOwnProperty('player1') && ( this.player1 = payload.gameData.player1 );
            payload.gameData.hasOwnProperty('player2') && ( this.player2 = payload.gameData.player2 );

            this.player1.profile !== null && this.setPlayer('player1');
            this.player2.profile !== null && this.setPlayer('player2');
        }
    }

    newVisitorHandler = (payload)=>{
        const { userId:senderId, players, visitors, gameData } = payload;

        // console.log(players,gameData)

        this.players = players;
        this.visitors = visitors;
        this.gameData = gameData;
        
        if(senderId === this.userProperties.userId){
            gameData.hasOwnProperty('activeGame') && (this.activeGame = gameData.activeGame);
            gameData.hasOwnProperty('player1') && (this.player1 = gameData.player1);
            gameData.hasOwnProperty('player2') && (this.player2 = gameData.player2);
            this.startVsRealPlayer();
        }

        
        this.createVisitorsAvatars();
    }

    newPlayerHandler = (payload)=>{
        const { userId:senderId, players, visitors, gameData } = payload;

        // console.log(players,gameData)

        gameData.hasOwnProperty('activeGame') && (this.activeGame = gameData.activeGame);
        if(gameData.hasOwnProperty('player1')){
            this.player1 = gameData.player1;
            this.player1.profile !==null && this.setPlayerAvatar('player1');
        }
        if(gameData.hasOwnProperty('player2')){
            this.player2 = gameData.player2;
            this.player2.profile !==null && this.setPlayerAvatar('player2');
        }
        
        this.resetPlayersIfNullData();

        if(senderId === this.userProperties.userId){
            this.chessRestartBtn.show();
            // console.log('it is sender')
            if(this.player1.profile !== null && this.player2.profile !==null){
                this.send({
                    eventName: GAME_EVENTS.GAME_START,
                    userId: this.userProperties.userId,
                    gameId: this.dbConfig.id,
                    gameData: {'activeGame': true}
                });
            }else{
                // console.log(this.player1, this.player2);
            }
        }else{
            // console.log('sender not match', this.userProperties, senderId);
        }

        this.players = players;
        this.visitors = visitors;
        this.createVisitorsAvatars();
    }

    createVisitorsAvatars = () =>{
        this.chessVisitorsAvatars.html("");
        let removeFromVisitorsCounter = 0;

        for(const key in this.visitors){
            const { userId, userName, userAvatarUrl, status } = this.visitors[key];

            // This condition must run on server when new visitor joins and remove user from visitors if he is a player (also have to update game data when user is disconnected - check if user was a player)
            if(this.player1.profile !== null){
                if(this.player1.profile.userId === userId){
                    removeFromVisitorsCounter++;
                    continue;
                }
            }
            if(this.player2.profile !== null){
                if(this.player2.profile.userId === userId){
                    removeFromVisitorsCounter++;
                    continue;
                }
            }

            // create visitor avatar
            this.chessVisitorsAvatars.append(`
                <div class="chess-visitor-avatar avatar_${userId}" data-id='${userId}'>
                    <img src="${userAvatarUrl}" alt="${userName}" class="avatar_${userId} chess_avatar_${userId} ${userId}">
                </div>
            `);
        }

        const visitorsLength = Object.keys(this.visitors).length - removeFromVisitorsCounter;
        this.chessVisitorsNumber.text(visitorsLength);

        this.visitorsNumberBlink();
    }

    gameStartHandler = (payload)=>{
        const { userId:senderId, players,  visitors, gameData } = payload;
        this.visitors = visitors;
        this.players = players;
        this.gameData = gameData;
        this.activeGame = this.gameData.activeGame;
        // console.log('game start handler', payload, this.activeGame)
        // if(this.activeGame){
        //     this.updateStatus()
        // }else{
            this.gameStart();
        // }
    }

    visitorPlayerLeftHandler = (payload)=>{
        const { userId, players, visitors, gameData, userStatus } = payload;

        // console.log('someone left', payload)
        
        if(userStatus){
            this.players = players;
            this.visitors = visitors;
            this.gameData = gameData;

            if(userStatus === 'visitor'){
                $(`.chess_avatar_${userId}`).remove();
                const visitorsLength = Object.keys(this.visitors).length;
                this.chessVisitorsNumber.text(visitorsLength);
                this.visitorsNumberBlink();
            }
                
            if(userStatus === 'player'){
                // todo: use concatenation inside a for loop for all players (on different games)
                // console.log('user who left was a player', this.player1, this.player2, userId)
                if(this.player1.profile !== null){
                    if(this.player1.profile.userId == userId){
                        this.playerOneContainer.addClass("chess-player-select");
                        this.playerOneContainer.removeClass("chess-player-info");
                        this.player1.profile = null;
    
                        this.playerOneImg.attr('src', `./textures/empty.png`);
                        this.chessPlayer1.material.map = emptySeatTexture;
                        this.chessPlayer1.visible = false;
                    }
                }

                if(this.player2.profile !== null){
                    if(this.player2.profile.userId == userId){
                        this.playerTwoContainer.addClass("chess-player-select");
                        this.playerTwoContainer.removeClass("chess-player-info");
                        this.player2.profile = null;
    
                        this.playerTwoImg.attr('src', `./textures/empty.png`);
                        this.chessPlayer2.material.map = emptySeatTexture;
                        this.chessPlayer2.visible = false;
                    }
                }
            }    
            
        }

    }

    resetPlayersIfNullData = () =>{
        if(this.player1.profile === null){
            this.playerOneContainer.addClass("chess-player-select");
            this.playerOneContainer.removeClass("chess-player-info");
            this.player1.profile = null;

            this.playerOneImg.attr('src', `./textures/empty.png`);
            this.chessPlayer1.material.map = emptySeatTexture;
            this.chessPlayer1.visible = false;
        }else{
            this.playerOneContainer.removeClass("chess-player-select");
            this.playerOneContainer.addClass("chess-player-info");
        }

        if(this.player2.profile === null){
            this.playerTwoContainer.addClass("chess-player-select");
            this.playerTwoContainer.removeClass("chess-player-info");
            this.player2.profile = null;

            this.playerTwoImg.attr('src', `./textures/empty.png`);
            this.chessPlayer2.material.map = emptySeatTexture;
            this.chessPlayer2.visible = false;
        }else{
            this.playerTwoContainer.removeClass("chess-player-select");
            this.playerTwoContainer.addClass("chess-player-info");
        }
    }

    flipBoard = () =>{

        this.board.flip();
        this.playerOneContainer.toggleClass('bottom');
        this.playerOneContainer.toggleClass('top');
        this.playerTwoContainer.toggleClass('bottom');
        this.playerTwoContainer.toggleClass('top');

       false && this.send({
            eventName: 'GAME_RESET_SOCKET',
            userId: this.userProperties.userId,
            gameId: this.dbConfig.id,
            data: { activeGame: false, player1: {color: 'w', profile: null}, player2: {color: 'w', profile: null}, fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', from: '', to: '', turn: 'w' }
        });
    }

    
    showInfo = (userId) =>{
        const data = this.peerData(userId);
        $("#chess-info-avatar").attr('src', data.userAvatarUrl);
        $("#chess-info-name").text(data.userName);
        $("#chess-info-id").val(data.userId);

        $(".chess-info-modal").addClass("is-active");
    }

    chat = (userId) =>{
        this.initiateChat(userId);
        $(".chess-info-modal").removeClass("is-active");
        this.minimizeGame();
    }

    videoCall = (userId) =>{
        this.initiateVideoCall(userId);
        $(".chess-info-modal").removeClass("is-active");
        this.minimizeGame();
    }

    toggleChessButtons = () =>{
        this.chessButtonsToggle.prop("checked", false);
    }

    visitorsStats = () =>{
        this.toggleVisitorsVisibility.toggleClass('active');
        this.visitorsContainer.toggleClass('active');
    }

}