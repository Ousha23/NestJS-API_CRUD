import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/createCommentDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const { postId, content } = createCommentDto;
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new NotFoundException('post not found');
    await this.prismaService.comment.create({
      data: { content, userId, postId },
    });
    return { data: 'Comment created' };
  }
  async delete(commentId: number, userId: any, postId: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!comment) throw new NotFoundException('comment not found');

    if (comment.postId !== postId)
      throw new UnauthorizedException('Post ID does not match');
    if (comment.userId !== userId)
      throw new ForbiddenException('Forbidden Action');
    await this.prismaService.comment.delete({ where: { commentId } });
    return { data: 'Comment deleted' };
  }

  async update(
    commentId: number,
    userId: any,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { postId, content } = updateCommentDto;
    const comment = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!comment) throw new NotFoundException('comment not found');

    if (comment.postId !== postId)
      throw new UnauthorizedException('Post ID does not match');
    if (comment.userId !== userId)
      throw new ForbiddenException('Forbidden Action');
    await this.prismaService.comment.update({
      where: { commentId },
      data: { content },
    });
    return { data: 'comment update' };
  }
}
