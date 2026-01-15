import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GigFlow API",
      version: "1.0.0",
      description: "API documentation for GigFlow backend",
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication APIs",
      },
      {
        name: "Gigs",
        description: "Gig management APIs",
      },
      {
        name: "Bids",
        description: "Bid management APIs",
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "gigflow.token",
        },
      },
      examples: {
        // REGISTER -> REQ & RES
        RegisterRequest: {
          summary: "Register a new user",
          value: {
            name: "Ashish Verma",
            email: "ashish@gmail.com",
            password: "123456",
          },
        },
        RegisterResponse: {
          summary: "New user registered.",
          value: {
            success: true,
            message: "User registered successfully",
          },
        },

        // LOGIN -> REQ & RES
        LoginRequest: {
          summary: "Login with emailid and password",
          value: {
            email: "ashish@gmail.com",
            password: "123456",
          },
        },
        LoginResponse: {
          summary: "User logged in successfully",
          value: {
            message: "Login successful",
            user: {
              id: "6967508a785f0c4caf8b513e",
              name: "Ashish Verma",
              email: "ashish@gmail.com",
            },
          },
        },

        // CREATING GIG -> REQ & RES
        CreateGigRequest: {
          summary: "Create gig request body",
          value: {
            title: "my title",
            description: "my description",
            budget: 900,
          },
        },
        CreateGigResponse: {
          summary: "Create gig success response",
          value: {
            success: true,
            message: "Gig created successfully",
            gig: {
              title: "my title",
              description: "my description",
              budget: 900,
              ownerId: "6967508a785f0c4caf8b513e",
              status: "open",
              _id: "69679d85f40e54b1f3db29b4",
              createdAt: "2026-01-14T13:43:33.924Z",
              updatedAt: "2026-01-14T13:43:33.924Z",
              __v: 0,
            },
          },
        },

        // GETTING GIGS -> RES
        GetGigsResponse: {
          summary: "Get open gigs success response",
          value: {
            success: true,
            count: 1,
            gigs: [
              {
                _id: "69679d85f40e54b1f3db29b4",
                title: "my title",
                description: "my description",
                budget: 520,
                ownerId: {
                  _id: "6967508a785f0c4caf8b513e",
                  name: "Ashish Verma",
                  email: "ashish@gmail.com",
                },
                status: "open",
                createdAt: "2026-01-14T13:43:33.924Z",
                updatedAt: "2026-01-14T13:43:33.924Z",
                __v: 0,
              },
            ],
          },
        },

        // SUBMITTING BID -> REQ & RES
        SubmitBidRequest: {
          summary: "Submit bid request",
          value: {
            gigId: "696744b835850e0404ad7cf4",
            message: "I want to join",
          },
        },
        SubmitBidResponse: {
          summary: "Response of submitted bid",
          value: {
            success: true,
            bid: {
              gigId: "696744b835850e0404ad7cf4",
              freelancerId: "6967508a785f0c4caf8b513e",
              message: "I want to join.",
              status: "pending",
              _id: "6967ce1f2d5a0780455e339a",
              createdAt: "2026-01-14T17:10:55.491Z",
              updatedAt: "2026-01-14T17:10:55.491Z",
              __v: 0,
            },
          },
        },

        // GETTING BIDS FOR A GIG -> RES
        GetBidsResponse: {
          summary: "Get all bids for a gig",
          value: {
            success: true,
            bids: [
              {
                _id: "696756580212befca6729424",
                gigId: "696744b835850e0404ad7cf4",
                freelancerId: {
                  _id: "6967508a785f0c4caf8b513e",
                  name: "B Verma",
                  email: "b@b.com",
                },
                message: "I want to join",
                status: "pending",
                createdAt: "2026-01-14T08:39:52.909Z",
                updatedAt: "2026-01-14T08:39:52.909Z",
                __v: 0,
              },
            ],
          },
        },
      },
    },
  },
  apis: ["./routes/*.ts"],
});
