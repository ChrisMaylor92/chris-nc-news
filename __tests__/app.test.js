const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endPoints = require('../endpoints.json')

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({articleData, commentData, topicData, userData});
});


describe("GET /api/(non existent end point)", () => {
    test("404", () => {
      return request(app)
        .get("/api/banana")
        .expect(404)
    });
})

describe("GET /api", () => {
    test("200 responds with an object describing all of the endpoints ", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({body}) => {
          expect(body).toEqual(endPoints)
          });
        });
    });


describe("GET /api/topics", () => {
    test("200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
})


describe("GET /api/articles", () => {
    test("200 sends an array of articles to the client", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
          expect(body.articles.length).toBe(13);
          body.articles.forEach((article) => {
            expect(typeof article.title).toBe("string");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.author).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
            expect(typeof article.comment_count).toBe("string");
            expect(article.body).toBe(undefined)
          });
        });
    });
})

describe("GET /api/articles?topic=(any) ", () => {
  test("200 sends an array of articles with a topic of mitch to the client", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("200 sends an array of articles with a topic of cats to the client", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
          expect(typeof article.title).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("200 sends an array of articles with a topic of paper to the client", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(0);
      });
  });
  test("400 bad request when passed a topic that doesnt exist", () => {
    return request(app)
      .get("/api/articles?topic=hats")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Topic does not exist.');

      });
  });
})

describe("GET /api/articles?sort_by=(any valid column)&order=(asc/desc)", () => {
  test("200 sends an array of articles to the client, sorted by article_id, defaults to desc with no order query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("article_id", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by article_id, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=desc")
      .expect(200)
      .then(({ body }) => {
     
        expect(body.articles).toBeSortedBy("article_id", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by article_id, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
      
        expect(body.articles).toBeSortedBy("article_id", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by title, defaults desc order query", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
       
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by title, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body }) => {
      
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by title, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("title", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by topic, defaults to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("topic", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by topic, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=desc")
      .expect(200)
      .then(({ body }) => {
       
        expect(body.articles).toBeSortedBy("topic", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by topic, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("topic", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by author, defaults to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
       
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by author, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=desc")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by author, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
      
        expect(body.articles).toBeSortedBy("author", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by created_at, defaults to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by created_at, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by created_at, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then(({ body }) => {
       
        expect(body.articles).toBeSortedBy("created_at", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by article_img_url, defaults to desc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_img_url", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by article_img_url, ordered desc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url&order=desc")
      .expect(200)
      .then(({ body }) => {
        
        expect(body.articles).toBeSortedBy("article_img_url", {
          descending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  test("200 sends an array of articles to the client, sorted by article_img_url, ordered asc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("article_img_url", {
          ascending: true,
    });
      expect(body.articles.length).toBe(13);
      body.articles.forEach((article) => {
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.author).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
          expect(article.body).toBe(undefined)
      });
    });
  });
  // test("400 Bad request, when passed a column that doesnt exist", () => {
  //   return request(app)
  //   .get("/api/articles?sort_by=banana")
  //   .expect(400)
  //   .then(({ body }) => {
  //     expect(body.msg).toBe('Bad request.');
     

  //   });
  // });
 
  
})
// describe("GET /api/articles?order=(asc/desc)", () => {
//   test("200 sends an array of articles to the client", () => {
//     return request(app)
//       .get("/api/articles")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.articles).toBeSortedBy("created_at", {
//           descending: true,
//         });
//         expect(body.articles.length).toBe(13);
//         body.articles.forEach((article) => {
//           expect(typeof article.title).toBe("string");
//           expect(typeof article.topic).toBe("string");
//           expect(typeof article.author).toBe("string");
//           expect(typeof article.created_at).toBe("string");
//           expect(typeof article.article_id).toBe("number");
//           expect(typeof article.article_img_url).toBe("string");
//           expect(typeof article.comment_count).toBe("string");
//           expect(article.body).toBe(undefined)
//         });
//       });
//   });
  
// })

describe("GET /api/articles/:article_id", () => {
    test("200 sends article object that matches the parametric article_ID to the client", () => {
        return request(app)
        .get(`/api/articles/5`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article.title).toBe("UNCOVERED: catspiracy to bring down democracy");
          expect(body.article.topic).toBe("cats");
          expect(body.article.author).toBe("rogersop");
          expect(body.article.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
          expect(body.article.votes).toBe(0);
          expect(body.article.created_at).toBe("2020-08-03T13:14:00.000Z");
          expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
          expect(body.article.article_id).toBe(5);
        });
    });
    test("400 bad request, wrong datatype used in parametric article_id", () => {
        return request(app)
        .get(`/api/articles/banana`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request.');
       
        });
    });
    test("404 not found, correct datatype used but nothing exists at that parametric article_id", () => {
        return request(app)
        .get(`/api/articles/15`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article does not exist.');
       
        });
    });
    test("200 sends article object that matches the parametric article_ID to the client, including a comment_count", () => {
      return request(app)
      .get(`/api/articles/5`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.title).toBe("UNCOVERED: catspiracy to bring down democracy");
        expect(body.article.topic).toBe("cats");
        expect(body.article.author).toBe("rogersop");
        expect(body.article.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
        expect(body.article.votes).toBe(0);
        expect(body.article.created_at).toBe("2020-08-03T13:14:00.000Z");
        expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        expect(body.article.article_id).toBe(5);
        expect(body.article.comment_count).toBe('2');
      });
  });
})


describe("PATCH /api/articles/:article_id", () => {
  test("200: changes article by article id", () => {
      const newVotes = { inc_votes: 5 }
      return request(app)
        .patch("/api/articles/5")
        .send(newVotes)
        .expect(200)
        .then(({ body }) => {
          console.log(body)
          expect(body.updatedArticle.title).toBe("UNCOVERED: catspiracy to bring down democracy");
          expect(body.updatedArticle.topic).toBe("cats");
          expect(body.updatedArticle.author).toBe("rogersop");
          expect(body.updatedArticle.body).toBe("Bastet walks amongst us, and the cats are taking arms!");
          expect(body.updatedArticle.votes).toBe(5);
          expect(body.updatedArticle.created_at).toBe("2020-08-03T13:14:00.000Z");
          expect(body.updatedArticle.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
          expect(body.updatedArticle.article_id).toBe(5);
        });
  })
  test("404 not found, correct datatype used but nothing exists at that parametric article_id", () => {
      const newVotes = { inc_votes: 5 }
      return request(app)
      .patch(`/api/articles/20`)
      .send(newVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist.');
     
      });
  });
  test("400 bad request, wrong datatype used ", () => {
    const newVotes = { inc_votes: 5 }
    return request(app)
    .patch(`/api/articles/banana`)
    .send(newVotes)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request.');
   
    });
  });
  test("400 bad request, wrong datatype used ", () => {
    const newVotes = { inc_votes: 'banana' }
    return request(app)
    .patch(`/api/articles/5`)
    .send(newVotes)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request.');
   
    });
  });
})



describe("POST /api/articles/:article_id/comments", () => {
  test("201: adds comment to comments table with corresponding article_id", () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'Im really enjoying my time learning to code at Northcoders.'
    }
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment.body).toBe('Im really enjoying my time learning to code at Northcoders.')
        expect(body.newComment.comment_id).toBe(19);
        expect(body.newComment.article_id).toBe(5);
        expect(body.newComment.author).toBe('butter_bridge');
        expect(body.newComment.votes).toBe(0);
        expect(typeof body.newComment.created_at).toBe('string');
      });
    });
    test('400: responds with an appropriate status and error message when provided without the correct properties', () => {
      return request(app)
        .post('/api/articles/5/comments')
        .send({
          colour: 'kat'
        })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad request.');
        });
    });
    test('400: responds with an appropriate status and error message when provided with correct properties but the wrong datatype', () => {
      const newComment = {
        username: 5,
        body: 'Im really enjoying my time learning to code at Northcoders.'
      }
      return request(app)
        .post('/api/articles/5/comments')
        .send(newComment)
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad request.');
        });
    });
    test('404: responds with an appropriate status and error message when provided with correct properties but an article that doesnt exist', () => {
      const newComment = {
        username: 'butter_bridge',
        body: 'Im really enjoying my time learning to code at Northcoders.'
      }
      return request(app)
        .post('/api/articles/20/comments')
        .send(newComment)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe('Article does not exist.');
        });
    });

  })


describe("GET /api/articles/:article_id/comments", () => {
  test("200 sends an array of comments to the client that matched the article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(5);
        });
      });
  });
  test("200 sends an array of comments to the client that matched the article_id, that is sorted by created_at DESC", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy( 'created_at', {descending: true})
      });
  });
  test("200 sends an array of comments to the client that matched the article_id, that is the correct length", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(2);
      });
  });
  test("200 sends an empty array of comments to the client when the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("404 sends error not found when given an article_id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/20/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article does not exist.');
      });
  });
  test("400 sends error bad request when given an article_id that is the wrong datatype", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request.');
      });
  });
  

})



describe("GET /api/users", () => {
  test("200 sends an array of users to the client", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});


describe("DELETE /api/comments/:comment_id", () => {
  test("200: deletes comment by comment_id", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({})
     
      });
  })
  test("400: wrong datatype in params", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request.');
      });
  })
  test("404 sends error not found when given an comment_id that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/25")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist.');
      });
  })
})

