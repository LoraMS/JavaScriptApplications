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

     rateLikes(paintingId){
         return firebase.firestore().collection("paintings").doc(paintingId).update({
            likes: firebase.firestore.FieldValue.increment(1)
        });
    }

    rateDislikes(paintingId){
        return firebase.firestore().collection("paintings").doc(paintingId).update({
            dislikes: firebase.firestore.FieldValue.increment(1)
        });
    }

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
}

const appModel = new AppModel();

export { appModel };