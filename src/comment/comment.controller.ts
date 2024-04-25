import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Request } from 'express';
import { CreateCommentDto } from './dto/createCommentDto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt')) // verif si la demande http contient le jeton jwt(json web tokens)
  @Post('create')
  create(@Body() createCommentDot: CreateCommentDto, @Req() request: Request) {
    const userId = request.user['userId'];
    return this.commentService.create(createCommentDot, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() request: Request,
    @Body("postId") postId : number,
  ) {
    const userId = request.user['userId'];
    return this.commentService.delete(commentId, userId, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updateComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Req() request: Request,
    @Body() updateCommentDto : UpdateCommentDto,
  ) {
    const userId = request.user['userId'];
    return this.commentService.update(commentId, userId, updateCommentDto);
  }
}
