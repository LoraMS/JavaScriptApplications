class AppModel {

    getPaintingsInfo(paintingId){
        return firebase.firestore().collection("paintings").doc(paintingId).get();
    }

    getAllPaintings(){
        return firebase.firestore().collection("paintings").get();
    }

    getArtistsInfo(artistName){
        return firebase.firestore().collection("artists").where("artistName", "==", artistName).get();
    }

    //  rateLikes(painting){
    //     let requestUrl = this._url + 'appdata/' + this._appKey + '/rateLikes';
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     let data = {
    //         paintingId : painting._id,
    //         like: 1
    //     };

    //     return this._requester.post(requestUrl, requestHeaders, data);
    // }

    // getLikes(paintingId){
    //     var filter = JSON.stringify({
    //         "paintingId": paintingId
    //     });

    //     let requestUrl = this._url + 'appdata/' + this._appKey + '/rateLikes/?query=' + filter;
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     return this._requester.get(requestUrl, requestHeaders);
    // }

    // rateDislikes(painting){
    //     let requestUrl = this._url + 'appdata/' + this._appKey + '/rateDislikes';
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     let data = {
    //         paintingId : painting._id,
    //         dislike: 1
    //     };

    //     return this._requester.post(requestUrl, requestHeaders, data);
    // }

    // getDislikes(paintingId){
    //     var filter = JSON.stringify({
    //         "paintingId": paintingId
    //     });

    //     let requestUrl = this._url + 'appdata/' + this._appKey + '/rateDislikes/?query=' + filter;
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     return this._requester.get(requestUrl, requestHeaders);
    // }

    // downloadPainting(id){
    //     let requestUrl = this._url + 'blob/' + this._appKey + '/' + id;
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     return this._requester.get(requestUrl, requestHeaders);
    // }

     addNewComment(comment, paintingId){
        return firebase.firestore().collection("paintings").doc(paintingId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
        });
    }

    getPaintingsInfoByStyle(style){
        return firebase.firestore().collection("paintings").where("style", "==", style).get();
    }

    getPaintingsInfoBySubject(subject){
        return firebase.firestore().collection("paintings").where("subject", "==", subject).get();
    }

    getPaintingsInfoByTechnique(technique){
        return firebase.firestore().collection("paintings").where("technique", "==", technique).get();
    }

    getPaintingsByTitle(title){
        const capitalize = (word) => {
            if (typeof word !== 'string') return ''
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
        let filter = capitalize(title);
        return firebase.firestore().collection("paintings").orderBy('title').startAt(filter).endAt(filter + '\uf8ff').get();
    }

    getPaintingsByArtist(artist){
        //  var filter = JSON.stringify({
        //     "artist.name": {"$regex":`^(?i)${artist}`}
        // });
        const capitalize = (word) => {
            if (typeof word !== 'string') return ''
            return word.charAt(0).toUpperCase() + word.slice(1)
        }
        let filter = capitalize(artist);
        return firebase.firestore().collection("paintings").orderBy('artistName').startAt(filter).endAt(filter + '\uf8ff').get();
    }

    // addMessage(data){
    //     let requestUrl = this._url + 'appdata/' + this._appKey + '/messages';
    //     let requestHeaders = this._authenticationService.getKinveyUserAuthHeaders();

    //     return this._requester.post(requestUrl, requestHeaders, data);
    // }
}

const appModel = new AppModel();

export { appModel };