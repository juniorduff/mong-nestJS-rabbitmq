/* eslint-disable import/no-extraneous-dependencies */
import spyObject from 'jest-spy-object';
import { v4 as uuid } from 'uuid';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PapersRepository } from '@papers/papers/infra/typeORM/repositories/papers.repository';
import { EQuestionType } from '@review-questions/review-questions/enum/EQuestion_type';
import { ReviewQuestionRepository } from '@review-questions/review-questions/infra/typeORM/repositories/review-question-repository';
import { EReviewRecommendation } from '@review-rules/review-rules/enum/EReview-recommendation';
import { ReviewRulesEntity } from '@review-rules/review-rules/infra/typeORM/entities/review-rules.entity';
import { ReviewRulesRepository } from '@review-rules/review-rules/infra/typeORM/repositories/review-rules-repository';
import { EReviewRecommendationReviews } from '@reviews/reviews/enum/EReviewRecommedation';
import { AnswerEntity } from '@reviews/reviews/infra/typeorm/entities/answer.entity';
import { ReviewsRepository } from '@reviews/reviews/infra/typeorm/repositories/reviews.repository';
import {
  mockPapersRepository,
  mockReviewQuestionRepository,
  mockReviewRepository,
  mockReviewRulesRepository,
  mockSubmissionModuleRepository,
  mockSubmissionRulesRepository,
  review_mock,
  review_question_mock
} from '@shared/shared/mocks';
import { ReviewsMock } from '@shared/shared/mocks/reviews.mock';
import { DateUtil } from '@shared/shared/util/date-util';
import { SubmissionModuleRepository } from '@submission-module/submission-module/infra/typeORM/repositories/submission-module.repository';
import { SubmissionRulesEntity } from '@submission-rules/submission-rules/infra/typeORM/entities/submissionRulesEntity';
import { SubmissionRulesRepository } from '@submission-rules/submission-rules/infra/typeORM/repositories/submission-rules.repository';

import { CreateReviewsService } from './create-reviews.service';

describe('Create Reviews Service', () => {
  let createReviewsService: CreateReviewsService;
  let mockcreateReviewDto = ReviewsMock.reviewData();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReviewsService,
        { provide: ReviewsRepository, useValue: mockReviewRepository },
        { provide: PapersRepository, useValue: mockPapersRepository },
        { provide: ReviewRulesRepository, useValue: mockReviewRulesRepository },
        {
          provide: SubmissionRulesRepository,
          useValue: mockSubmissionRulesRepository
        },
        {
          provide: ReviewQuestionRepository,
          useValue: mockReviewQuestionRepository
        },
        {
          provide: SubmissionModuleRepository,
          useValue: mockSubmissionModuleRepository
        }
      ]
    }).compile();
    jest.restoreAllMocks();

    createReviewsService =
      module.get<CreateReviewsService>(CreateReviewsService);
  });

  it('should be defined', () => {
    expect(createReviewsService).toBeDefined();
  });
  describe('create reviews', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
      // SPY mocks methods
      spyObject(mockReviewRepository);
      spyObject(mockPapersRepository);
      spyObject(mockSubmissionRulesRepository);
      spyObject(mockReviewRulesRepository);
      spyObject(mockReviewQuestionRepository);
      // mock success id
      mockReviewQuestionRepository.findAll()[0].id =
        mockcreateReviewDto.answers[0].question_id;

      mockcreateReviewDto = ReviewsMock.reviewData();
    });
    it('should be created create a review and return the same', async () => {
      // action
      const result = await createReviewsService.execute({
        paper_id: uuid(),
        createReviewDto: mockcreateReviewDto
      });
      // assertion
      expect(review_mock).toEqual(result);
    });
    it('should be throw a exception when paper is not found ', async () => {
      // mockPapersRepository.findById.mockReturnValue(null);
      jest.spyOn(mockPapersRepository, 'findById').mockReturnValue(null);
      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'not_found_paper'
          });
        });
    });

    it('should be throw a exception when submission_module is not found ', async () => {
      jest
        .spyOn(mockSubmissionModuleRepository, 'findById')
        .mockReturnValue(null);
      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'not_found_submission_module'
          });
        });
    });
    it('should be throw a exception when submission_rules is not found ', async () => {
      jest
        .spyOn(
          mockSubmissionRulesRepository,
          'findSubmissionBySubmissionModuleId'
        )
        .mockReturnValue(null);

      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'not_found_submission_rules'
          });
        });
    });
    it('should be throw a exception when reviewRules is not found ', async () => {
      jest
        .spyOn(mockReviewRulesRepository, 'findBySubmissionModuleId')
        .mockReturnValue(null);
      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
          expect(e).toMatchObject({
            message: 'review_rules_not_found'
          });
        });
    });
    it('should be throw a exception when submission_rules review_start_date is bigger than review_end_date', async () => {
      jest
        .spyOn(
          mockSubmissionRulesRepository,
          'findSubmissionBySubmissionModuleId'
        )
        .mockReturnValue({
          review_start_date: DateUtil.getDateNow({
            addhours: 10
          }),
          review_end_date: DateUtil.getDateNow({
            addhours: 20
          })
        } as SubmissionRulesEntity);
      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'outside_the_review_period'
          });
        });
    });
    it('should be throw a exception when max review  paper is  achieved', async () => {
      jest
        .spyOn(mockReviewRulesRepository, 'findBySubmissionModuleId')
        .mockReturnValue({
          number_of_reviewers: 1
        } as ReviewRulesEntity);
      await createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'exceeded_max_reviews'
          });
        });
    });

    it('should be throw a exception when review_recomendation is DEFINITELY_REJECT/DEFINITELY_ACCEPT/POSSIBLY_ACCEPT/POSSIBLY_REJECT and review_recommendation_type is simple_decision', async () => {
      // mock
      jest
        .spyOn(mockReviewRulesRepository, 'findBySubmissionModuleId')
        .mockReturnValue({
          review_recommendation_type: EReviewRecommendation.simple_decision
        } as ReviewRulesEntity);
      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.DEFINITELY_ACCEPT;
      // action
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'accepted_values_must_be_accept_or_reject'
          });
        });

      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.DEFINITELY_REJECT;
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'accepted_values_must_be_accept_or_reject'
          });
        });
      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.POSSIBLY_ACCEPT;
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'accepted_values_must_be_accept_or_reject'
          });
        });
      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.POSSIBLY_REJECT;
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'accepted_values_must_be_accept_or_reject'
          });
        });
    });

    it('should be throw a exception when review_recomendation is ACCEPT or REJECT and review_recommendation_type is complex_decision', async () => {
      // mock
      jest
        .spyOn(mockReviewRulesRepository, 'findBySubmissionModuleId')
        .mockReturnValue({
          review_recommendation_type: EReviewRecommendation.complex_decision
        } as ReviewRulesEntity);
      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.ACCEPT;
      // action
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message:
              'accepted_values_must_be_POSSIBLY_ACCEPT_or_POSSIBLY_REJECT_OR_DEFINITELY_ACCEPT_OR_DEFINITELY_REJECT'
          });
        });
      mockcreateReviewDto.review_recommendation =
        EReviewRecommendationReviews.REJECT;
      await createReviewsService
        .execute({
          createReviewDto: {
            ...mockcreateReviewDto
          },
          paper_id: uuid()
        })
        .catch((e) => {
          // assert
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message:
              'accepted_values_must_be_POSSIBLY_ACCEPT_or_POSSIBLY_REJECT_OR_DEFINITELY_ACCEPT_OR_DEFINITELY_REJECT'
          });
        });
    });
    it('should be throw a exception when review question  when not exist ', () => {
      jest.spyOn(mockReviewRepository, 'findById').mockReturnValue(null);
      createReviewsService
        .execute({
          createReviewDto: ReviewsMock.reviewData(),
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(NotFoundException);
        });
    });
  });
  it(
    'should be throw a exception when type of review_question_type is ' +
      'SELECT TEXTFIELD TEXTAREA RADIOBUTTON  and value of answer.value  send is different of string ' +
      'and is review_question.required = true',
    async () => {
      review_question_mock.type = EQuestionType.CHECKBOX;
      review_question_mock.required = true;
      let createReviewDto = mockcreateReviewDto;
      jest
        .spyOn(mockReviewRepository, 'findById')
        .mockReturnValue(createReviewDto);

      createReviewDto.answers = createReviewDto.answers.map((a) => {
        a.value = null;
        a.value = 'a;';
        return a;
      });
      jest
        .spyOn(mockReviewQuestionRepository, 'findById')
        .mockReturnValue(review_question_mock);
      await createReviewsService
        .execute({
          createReviewDto,
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'question_type_must_be_a_boolean'
          });
        });
    }
  );
  it(
    'should be throw a exception when type of review_question_type is      ' +
      ' CHECKBOX  and value of answer.value  send is different of string' +
      ' and is review_question.required = true ',
    async () => {
      review_question_mock.type = EQuestionType.TEXTAREA;
      review_question_mock.required = true;
      let createReviewDto = mockcreateReviewDto;
      jest
        .spyOn(mockReviewRepository, 'findById')
        .mockReturnValue(createReviewDto);

      createReviewDto.answers = createReviewDto.answers.map((a) => {
        a.value = null;
        a.value = 2;
        return a;
      });
      jest
        .spyOn(mockReviewQuestionRepository, 'findById')
        .mockReturnValue(review_question_mock);
      await createReviewsService
        .execute({
          createReviewDto,
          paper_id: uuid()
        })
        .catch((e) => {
          expect(e).toBeInstanceOf(BadRequestException);
          expect(e).toMatchObject({
            message: 'question_type_must_be_a_string'
          });
        });
    }
  );
  it('should be throw a exception when type of review_question_type is  number ', async () => {
    review_question_mock.type = EQuestionType.NUMBER;
    review_question_mock.required = true;
    let createReviewDto = mockcreateReviewDto;
    jest
      .spyOn(mockReviewRepository, 'findById')
      .mockReturnValue(createReviewDto);

    createReviewDto.answers = createReviewDto.answers.map((a) => {
      a.value = null;
      a.value = '2';
      return a;
    });
    jest
      .spyOn(mockReviewQuestionRepository, 'findById')
      .mockReturnValue(review_question_mock);
    await createReviewsService
      .execute({
        createReviewDto,
        paper_id: uuid()
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e).toMatchObject({
          message: 'question_type_must_be_a_number'
        });
      });
  });
  it('should be throw a exception when awnser is not contain id for update ', async () => {
    const createReviewDto = mockcreateReviewDto;
    createReviewDto.answers = null;

    let answer = new AnswerEntity();
    answer.id = null;
    answer.value = 2;
    answer.question_id = 'ok2';
    answer.review_id = 'ok2';

    createReviewDto.answers = [answer];
    review_question_mock.type = EQuestionType.NUMBER;
    review_question_mock.required = true;
    review_question_mock.min_length = 2;
    jest
      .spyOn(mockReviewRepository, 'findById')
      .mockReturnValue(createReviewDto);
    jest
      .spyOn(mockReviewQuestionRepository, 'findById')
      .mockReturnValue(review_question_mock);
    await createReviewsService
      .execute({
        createReviewDto,
        paper_id: uuid()
      })
      .catch((e) => {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e).toMatchObject({
          message: 'is_missing_answer_id'
        });
      });
  });
});
