import toastr from 'toastr';
import { appModel } from 'appModel';
import { userModel } from 'userModel';
import { templates } from 'templates';
import { userController } from 'userController';
import { shoppingCartController } from 'shoppingCartController';
import { shoppingCartManager } from 'shoppingCartManager';


let appController = (function () {
    class AppController {
        constructor(templates, appModel) {
            this.templates = templates;
            this.appModel = appModel;
        }

        getHomePage(selector) {
            $(selector).empty();
            this.templates.getTemplate('load-home-page').then((responseTemplate) => {
                selector.html(responseTemplate());
            });
        }

        getGallery(selector) {
            $(selector).empty();
            let result;
            this.appModel.getAllPaintings().then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display gallery!');
                location.hash = '#/home';
            });
        }

        getPaintingById(selector, id) {
            $(selector).empty();
            let result;
            let resultComments;
            let self = this;
            this.appModel.getPaintingsInfo(id).then((item) => {
                    result = item.data();
                    return templates.getTemplate('paintings-info');
                }).then(function (template) {
                    selector.html(template(result));
                    let user = localStorage.getItem('email');
                    if(user){
                        $('#textarea-comment').removeClass('hidden');
                        $('#add-comment').removeClass('hidden');
                        $('#log-reg').addClass('hidden');
                    } else {
                        $('#textarea-comment').addClass('hidden');
                        $('#add-comment').addClass('hidden');
                        $('#log-reg').removeClass('hidden');
                    }

                    $('.like').on('click', function () {
                        if(!user){
                            toastr.error("Please login or register");
                            location.hash = '#/register';
                            return;
                        }
                        self.appModel.rateLikes(id)
                            .then(function (data) {
                                $('.like').attr('disabled', true);
                                toastr.success('You like this painting');
                            });
                    });

                    $('.dislike').on('click', function () {
                        if(!user){
                            toastr.error("Please login or register");
                            location.hash = '#/register';
                            return;
                        }
                        self.appModel.rateDislikes(id)
                            .then(function (data) {
                                $('.dislike').attr('disabled', true);
                                toastr.success('You dislike this painting');
                            });
                    });

                    let likes = result.likes;
                    let dislikes = result.dislikes;
                    let rating = calculateStarRating(likes, dislikes);
                    let style =`--rating: ${rating};`;
                    $('.stars-rating').attr('style',style); 


                    $('.download').on('click', function () {
                       return downloadWithSuccess(result);
                    });

                    $('#add-comment').on('click', function (ev) {
                        let content = {
                            date: moment().format("ll"),
                            text: $('#textarea-comment').val(),
                            user: user,
                        };
                                
                        if (content.text === "") {
                            toastr.error("You have not write a comment!");
                            ev.preventDefault();
                            return;
                        }
                        self.appModel.addNewComment(content, id).then(function (data) {
                            toastr.success('Comment was added');
                        }).catch(function (error) {
                            console.log(error);
                            toastr.error('Try again');
                        });

                        self.appModel.getPaintingsInfo(id).then((commentsData) => {
                            resultComments = commentsData.data();
                            return templates.getTemplate('paintings-info');
                        }).then(function (template) {
                            selector.html(template(resultComments));
                        });
                    });
              })
                .then(() => {
                    let user = localStorage.getItem('email');
                    $('.buy').on('click', function() {
                        if(!user){
                            toastr.error("Please login or register");
                            location.hash = '#/register';
                            return;
                        }
                        return addToCart(result, id);
                    });
                    if (shoppingCartManager.isAdded(id)) {
                        $('.buy').attr('disabled', true);
                    } else {
                        $('.buy').attr('disabled', false);
                    }
                })
                .catch(function (error) {
                    toastr.error('Unable to display painting!');
                    console.log(error);
                    location.hash = '#/paintings';
                });
        }

        getPaintingByArtist(selector, artist) {
            $(selector).empty();
            let result;
            this.appModel.getArtistsInfo(artist).then((item) => {
                let artist = item.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    artist
                };
                return templates.getTemplate('artist-info');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                console.log(error);
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }

        getPaintingsByStyle(selector, style) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoByStyle(style).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        getPaintingsBySubject(selector, subject) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoBySubject(subject).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        getPaintingsByTechnique(selector, technique) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsInfoByTechnique(technique).then((items) => {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));
            }).catch(function (error) {
                toastr.error('Unable to display paintings!');
                location.hash = '#/paintings';
            });
        }

        searchByTitle(selector, title) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsByTitle(title).then(function (items) {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));

            }).catch(function (error) {
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }

        searchByArtist(selector, artist) {
            $(selector).empty();
            let result;
            this.appModel.getPaintingsByArtist(artist).then(function (items) {
                let paintings = items.docs.map((d) => {return {...d.data(), id: d.id}});
                result = {
                    paintings
                };
                return templates.getTemplate('load-gallery');
            }).then(function (template) {
                selector.html(template(result));

            }).catch(function (error) {
                toastr.error('Unable to display painting!');
                location.hash = '#/paintings';
            });
        }
    }

    function addToCart(paintingData, id) {
        let newItmensCount = shoppingCartManager.shoppingItemsCountElement.text(),
            cartCountElement = shoppingCartManager.shoppingItemsCountElement;
        newItmensCount++;
        cartCountElement.text(newItmensCount);
        shoppingCartManager.items.push({
            id: id,
            image: paintingData.imageURL,
            title: paintingData.title,
            author: paintingData.artistName,
            price: paintingData.price
        });
        $('.buy').attr('disabled', true);
    }

    function downloadWithSuccess(data) {
        let link = document.createElement('a');
        link.download = data.title + '.jpg';
        link.href = data.imageURL + '&authuser=0&export=download';
        document.body.appendChild(link);
        link.click();
    }

    function calculateStarRating(likes, dislikes){ 
        const maxNumberOfStars = 5; 
        let totalRating = likes + dislikes;
        let likePercentageStars = (likes / totalRating) * maxNumberOfStars;
        return likePercentageStars;
    }

    return new AppController(templates, appModel);
})();

export { appController };