import {faker} from '@faker-js/faker';

export function generateRandomPosts(count:number){
    const posts = [];
    const visibility = ['public', 'friends', 'private'];
    const conditions = ['sunny', 'rainy', 'cloudy', 'snowy'];
    for(let i = 0; i < count; i++){
        let randomNumber = faker.datatype.number({min: 0, max: 3});
        let taggedUsernames = [];
        for (let j = 0; j < randomNumber; j++){
            taggedUsernames.push(faker.internet.userName());
        }
        posts.push({
            _id: faker.string.uuid(),  
            content: faker.lorem.paragraph(),
            username: faker.internet.userName(),
            createdDate: faker.date.past(),
            updatedDate: faker.date.past(),
            pictureAttached: faker.datatype.boolean(),
            taggedUsernames: taggedUsernames,
            visibility: visibility[faker.datatype.number({min: 0, max: 2})],
            weatherVibe: {
                enabled: faker.datatype.boolean(),
                caption: faker.lorem.sentence(),
                weatherData: {
                    condition: conditions[faker.datatype.number({min: 0, max: 3})],
                    temperature: faker.datatype.number({min: 0, max: 100})
                }
            }  
        })   
    }
    return posts;
}

export function generateRandomComments(count:number){

}

export function generateRandomPicturesForPost(count:number){
    const pictures = [];
    for(let i = 0; i < count; i++){
        pictures.push({
            _id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            picturePath: faker.image.url(),
            createdDate: faker.date.past(),
            targetId: faker.string.uuid(),
            username: faker.internet.userName(),
            description: faker.lorem.paragraph()
        })
    }
    return pictures;
}