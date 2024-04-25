import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/createPost.dto';
import { Request } from 'express';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.postService.create(createPostDto, userId);
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: Request,
  ) {
    const userId = request.user['userId'];
    return this.postService.delete(postId, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @Req() request: Request,
  ) {
    const userId = request.user['userId'];
    return this.postService.update(postId, userId, updatePostDto);
  }
}
